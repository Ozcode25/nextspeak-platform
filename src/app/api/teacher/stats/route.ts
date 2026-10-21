import { NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await requireAuth(['teacher']);
    
    const supabase = createClient();
    
    const [
      { count: totalStudents },
      { count: activeStudents },
      { count: totalCourses },
      { count: totalLessons },
      { data: tokens },
      { data: progressData },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('teacher_id', user.user_id),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('teacher_id', user.user_id).eq('is_active', true),
      supabase.from('courses').select('*', { count: 'exact', head: true }).eq('teacher_id', user.user_id),
      supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('courses.teacher_id', user.user_id),
      supabase.from('tokens').select('*').eq('teacher_id', user.user_id),
      supabase.from('progress_entries').select('completed, lesson_id, student_id').eq('lessons.courses.teacher_id', user.user_id),
    ]);
    
    const tokensData = tokens as Array<{ is_revoked: boolean; expires_at: string }> | null;
    
    const tokensIssued = tokensData?.length || 0;
    const tokensActive = tokensData?.filter(t => !t.is_revoked && new Date(t.expires_at) > new Date()).length || 0;
    const tokensRevoked = tokensData?.filter(t => t.is_revoked).length || 0;
    
    const progressDataTyped = progressData as Array<{ completed: boolean }> | null;
    
    const totalProgressEntries = progressDataTyped?.length || 0;
    const completedProgressEntries = progressDataTyped?.filter(p => p.completed).length || 0;
    const averageCompletionRate = totalProgressEntries > 0 ? Math.round((completedProgressEntries / totalProgressEntries) * 100) : 0;
    
    const stats = {
      total_students: totalStudents || 0,
      active_students: activeStudents || 0,
      total_courses: totalCourses || 0,
      total_lessons: totalLessons || 0,
      average_completion_rate: averageCompletionRate,
      tokens_issued: tokensIssued,
      tokens_active: tokensActive,
      tokens_revoked: tokensRevoked,
    };
    
    return NextResponse.json(createApiResponse(stats));
  } catch (error) {
    console.error('Teacher stats error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}