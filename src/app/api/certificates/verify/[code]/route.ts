import { NextRequest, NextResponse } from 'next/server';
import { createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    const supabase = createClient();
    
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select(`
        *,
        students:users!certificates_student_id_fkey(name, email),
        courses(name, teacher_id),
        teachers:users!courses_teacher_id_fkey(name)
      `)
      .eq('verification_code', code.toUpperCase())
      .single();
    
    if (error || !certificate) {
      return NextResponse.json(createApiResponse('Certificado no encontrado'), { status: 404 });
    }
    
    const cert = certificate as { 
      verification_code: string; 
      students: { name: string; email: string }; 
      courses: { name: string }; 
      teachers: { name: string };
      issued_at: string;
      name: string;
      description: string;
    };
    
    return NextResponse.json(createApiResponse({
      verification_code: cert.verification_code,
      student_name: cert.students.name,
      student_email: cert.students.email,
      course_name: cert.courses.name,
      teacher_name: cert.teachers.name,
      issued_at: cert.issued_at,
      name: cert.name,
      description: cert.description,
    }));
  } catch (error) {
    console.error('Verify certificate error:', error);
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}