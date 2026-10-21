import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse, generateVerificationCode } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireAuth();
    const { courseId } = await params;
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    
    const supabase = createClient();
    
    let targetStudentId = user.user_id;
    
    if (user.role === 'teacher') {
      if (!studentId) {
        return NextResponse.json(createApiResponse('student_id requerido'), { status: 400 });
      }
      
      const { data: student } = await supabase
        .from('users')
        .select('teacher_id')
        .eq('id', studentId)
        .single();
      
      const studentData = student as { teacher_id: string } | null;
      
      if (!studentData || studentData.teacher_id !== user.user_id) {
        return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
      }
      
      targetStudentId = studentId;
    }
    
    const { data: certificates, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', targetStudentId)
      .eq('course_id', courseId)
      .order('issued_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(createApiResponse(certificates || []));
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireAuth(['teacher']);
    const { courseId } = await params;
    const { student_id, name, description } = await request.json();
    
    if (!student_id || !name) {
      return NextResponse.json(createApiResponse('student_id y nombre son requeridos'), { status: 400 });
    }
    
    const supabase = createClient();
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single();
    
    const courseData = course as { teacher_id: string } | null;
    
    if (courseError || !courseData || courseData.teacher_id !== user.user_id) {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('teacher_id')
      .eq('id', student_id)
      .single();
    
    const studentData = student as { teacher_id: string } | null;
    
    if (studentError || !studentData || studentData.teacher_id !== user.user_id) {
      return NextResponse.json(createApiResponse('Estudiante no encontrado'), { status: 404 });
    }
    
    const verificationCode = generateVerificationCode();
    
    const { data: certificate, error } = await supabase
      .from('certificates')
      .insert({
        student_id,
        course_id: courseId,
        name,
        description: description || `Certificado de finalización del curso`,
        verification_code: verificationCode,
      } as any)
      .select()
      .single();
    
    if (error || !certificate) {
      return NextResponse.json(createApiResponse('Error al crear certificado'), { status: 500 });
    }
    
    return NextResponse.json(createApiResponse(certificate), { status: 201 });
  } catch (error) {
    console.error('Create certificate error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}