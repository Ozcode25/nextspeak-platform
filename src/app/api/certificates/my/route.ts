import { NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';
import { getUserById } from '@/lib/db-server';

export async function GET() {
  try {
    const user = await requireAuth(['student']);
    
    // Get full user data including name
    const { data: userData } = await getUserById(user.user_id);
    
    const supabase = createClient();
    
    const { data: certificates, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses(
          id,
          name,
          teacher_id,
          teachers:users!courses_teacher_id_fkey(name)
        )
      `)
      .eq('student_id', user.user_id)
      .order('issued_at', { ascending: false });
    
    if (error) throw error;
    
    const certificatesWithDetails = (certificates as Array<{ courses: { id: string; name: string; teachers: { name: string } } }>)?.map(cert => ({
      ...cert,
      course: {
        id: cert.courses.id,
        name: cert.courses.name,
        teacher: {
          name: cert.courses.teachers?.name || 'Docente',
        },
      },
      student: {
        name: userData?.name || user.email,
        email: user.email,
      },
    })) || [];
    
    return NextResponse.json(createApiResponse(certificatesWithDetails));
  } catch (error) {
    console.error('Get certificates error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}