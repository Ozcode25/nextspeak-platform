import { NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await requireAuth(['student']);
    
    const supabase = createClient();
    
    // Get student's tokens to find their courses
    const { data: tokens, error: tokensError } = await supabase
      .from('tokens')
      .select('course_id, courses(*)')
      .eq('student_id', user.user_id)
      .eq('is_revoked', false)
      .gt('expires_at', new Date().toISOString());
    
    if (tokensError) throw tokensError;
    
    const tokensData = tokens as Array<{ course_id: string }> | null;
    const courseIds = tokensData?.map(t => t.course_id).filter(Boolean) || [];
    
    if (courseIds.length === 0) {
      return NextResponse.json(createApiResponse([]));
    }
    
    // Get courses with lessons
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        lessons(count)
      `)
      .in('id', courseIds)
      .eq('is_published', true);
    
    if (coursesError) throw coursesError;
    
    const coursesData = courses as Array<{ id: string; total_classes: number; lessons: Array<{ count: number }> }> | null;
    
    // Get progress for each course
    const { data: progressData } = await supabase
      .from('progress_entries')
      .select(`
        completed,
        lesson_id,
        lessons!inner(course_id, week_number, class_number, title, order)
      `)
      .eq('student_id', user.user_id)
      .in('lessons.course_id', courseIds)
      .order('lessons.order', { ascending: true });
    
    const progressDataTyped = progressData as Array<{ 
      completed: boolean; 
      lesson_id: string; 
      lessons: { course_id: string; week_number: number; class_number: number; title: string; order: number } 
    }> | null;
    
    // Calculate progress for each course
    const coursesWithProgress = coursesData?.map(course => {
      const courseProgress = progressDataTyped?.filter(p => p.lessons?.course_id === course.id) || [];
      const completedLessons = courseProgress.filter(p => p.completed).length;
      const totalLessons = courseProgress.length || course.total_classes;
      
      // Find next incomplete lesson
      const nextProgressEntry = courseProgress.find(p => !p.completed);
      const nextLesson = nextProgressEntry?.lessons;
      
      return {
        ...course,
        lessons_count: course.lessons?.[0]?.count || 0,
        progress: {
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          next_lesson: nextLesson ? {
            id: nextProgressEntry!.lesson_id,
            course_id: nextLesson.course_id,
            week_number: nextLesson.week_number,
            class_number: nextLesson.class_number,
            title: nextLesson.title,
            order: nextLesson.order,
          } : null,
        },
      };
    }) || [];
    
    return NextResponse.json(createApiResponse(coursesWithProgress));
  } catch (error) {
    console.error('Student courses error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}