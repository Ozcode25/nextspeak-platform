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
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single();
    
    const courseData = course as { teacher_id: string } | null;
    
    if (courseError || !courseData) {
      return NextResponse.json(createApiResponse('Curso no encontrado'), { status: 404 });
    }
    
    if (user.role === 'teacher' && courseData.teacher_id !== user.user_id) {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('week_number', { ascending: true })
      .order('class_number', { ascending: true });
    
    if (error) throw error;
    
    return NextResponse.json(createApiResponse(lessons || []));
  } catch (error) {
    console.error('Get lessons error:', error);
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
    const lessonData = await request.json();
    
    const supabase = createClient();
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('teacher_id')
      .eq('id', courseId)
      .single();
    
    const courseData = course as { teacher_id: string } | null;
    
    if (courseError || !courseData) {
      return NextResponse.json(createApiResponse('Curso no encontrado'), { status: 404 });
    }
    
    if (courseData.teacher_id !== user.user_id) {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        ...lessonData,
        course_id: courseId,
      })
      .select()
      .single();
    
    if (error || !lesson) {
      return NextResponse.json(createApiResponse('Error al crear lección'), { status: 500 });
    }
    
    return NextResponse.json(createApiResponse(lesson), { status: 201 });
  } catch (error) {
    console.error('Create lesson error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}