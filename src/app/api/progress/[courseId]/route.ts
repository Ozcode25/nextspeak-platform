import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireAuth();
    const { courseId } = await params;
    
    const supabase = createClient();
    
    let studentId = user.user_id;
    
    if (user.role === 'teacher') {
      const { searchParams } = new URL(request.url);
      studentId = searchParams.get('student_id') || user.user_id;
      
      const { data: student } = await supabase
        .from('users')
        .select('teacher_id')
        .eq('id', studentId)
        .single();
      
      const studentData = student as { teacher_id: string } | null;
      
      if (!studentData || studentData.teacher_id !== user.user_id) {
        return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
      }
    }
    
    const { data: progress, error } = await supabase
      .from('progress_entries')
      .select(`
        *,
        lessons!inner(course_id, week_number, class_number, title)
      `)
      .eq('student_id', studentId)
      .eq('lessons.course_id', courseId);
    
    if (error) throw error;
    
    return NextResponse.json(createApiResponse(progress || []));
  } catch (error) {
    console.error('Get progress error:', error);
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
    const user = await requireAuth(['student']);
    const { courseId } = await params;
    const { lesson_id, completed, score, time_spent } = await request.json();
    
    const supabase = createClient();
    
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('course_id')
      .eq('id', lesson_id)
      .single();
    
    const lessonData = lesson as { course_id: string } | null;
    
    if (lessonError || !lessonData || lessonData.course_id !== courseId) {
      return NextResponse.json(createApiResponse('Lección no encontrada'), { status: 404 });
    }
    
    const { data: progress, error } = await supabase
      .from('progress_entries')
      .upsert({
        student_id: user.user_id,
        lesson_id,
        completed: completed || false,
        score: score || null,
        time_spent: time_spent || 0,
        completed_at: completed ? new Date().toISOString() : null,
      } as any)
      .select()
      .single();
    
    if (error || !progress) {
      return NextResponse.json(createApiResponse('Error al actualizar progreso'), { status: 500 });
    }
    
    return NextResponse.json(createApiResponse(progress));
  } catch (error) {
    console.error('Update progress error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}