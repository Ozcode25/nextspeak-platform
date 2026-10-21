import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await requireAuth();
    const { lessonId } = await params;
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    
    const supabase = createClient();
    
    let query = supabase
      .from('assignments')
      .select(`
        *,
        lessons!inner(course_id, title),
        students:users!assignments_student_id_fkey(id, name, email)
      `)
      .eq('lesson_id', lessonId);
    
    if (user.role === 'student') {
      query = query.eq('student_id', user.user_id);
    } else if (user.role === 'teacher' && studentId) {
      query = query.eq('student_id', studentId);
    }
    
    const { data: assignments, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(createApiResponse(assignments || []));
  } catch (error) {
    console.error('Get assignments error:', error);
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
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await requireAuth();
    const { lessonId } = await params;
    const assignmentData = await request.json();
    
    const supabase = createClient();
    
    let studentId = user.user_id;
    
    if (user.role === 'teacher') {
      studentId = assignmentData.student_id;
      if (!studentId) {
        return NextResponse.json(createApiResponse('student_id es requerido para docentes'), { status: 400 });
      }
    }
    
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('course_id, courses!inner(teacher_id)')
      .eq('id', lessonId)
      .single();
    
    if (lessonError || !lesson) {
      return NextResponse.json(createApiResponse('Lección no encontrada'), { status: 404 });
    }
    
    const lessonData = lesson as { course_id: string; courses: { teacher_id: string } };
    
    if (user.role === 'teacher' && lessonData.courses.teacher_id !== user.user_id) {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    
    const { data: assignment, error } = await supabase
      .from('assignments')
      .insert({
        lesson_id: lessonId,
        student_id: studentId,
        title: assignmentData.title,
        description: assignmentData.description,
        type: assignmentData.type,
        status: 'pending',
        due_date: assignmentData.due_date,
      } as any)
      .select()
      .single();
    
    if (error || !assignment) {
      return NextResponse.json(createApiResponse('Error al crear tarea'), { status: 500 });
    }
    
    return NextResponse.json(createApiResponse(assignment), { status: 201 });
  } catch (error) {
    console.error('Create assignment error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}