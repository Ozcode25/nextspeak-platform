import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { revokeStudentTokens, deactivateStudent } from '@/lib/db-server';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(['teacher']);
    const { student_id } = await request.json();
    
    if (!student_id) {
      return NextResponse.json(createApiResponse('student_id es requerido'), { status: 400 });
    }
    
    // Revoke all active tokens for this student from this teacher
    const { error: tokenError } = await revokeStudentTokens(student_id, user.user_id);
    
    if (tokenError) throw tokenError;
    
    // Deactivate student account
    await deactivateStudent(student_id);
    
    return NextResponse.json(createApiResponse({ success: true }));
  } catch (error) {
    console.error('Revoke token error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}