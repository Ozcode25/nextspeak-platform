import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(['teacher']);
    const { id } = await params;
    const { reason } = await request.json();
    
    const supabase = createClient();
    
    const { data: token, error: fetchError } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', id)
      .eq('teacher_id', user.user_id)
      .single();
    
    if (fetchError || !token) {
      return NextResponse.json(createApiResponse('Token no encontrado'), { status: 404 });
    }
    
    const tokenData = token as { is_revoked: boolean; student_id: string | null };
    
    if (tokenData.is_revoked) {
      return NextResponse.json(createApiResponse('El token ya está revocado'), { status: 400 });
    }
    
    // @ts-ignore
    const { data: updatedToken, error } = await supabase
      .from('tokens')
      // @ts-ignore
      .update({
        is_revoked: true,
        revoked_at: new Date().toISOString(),
        revoked_reason: reason || 'Revocado por el docente',
      } as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !updatedToken) {
      return NextResponse.json(createApiResponse('Error al revocar token'), { status: 500 });
    }
    
    if (tokenData.student_id) {
      await supabase
        .from('users')
        // @ts-ignore
        .update({ is_active: false } as any)
        .eq('id', tokenData.student_id);
    }
    
    return NextResponse.json(createApiResponse(updatedToken));
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