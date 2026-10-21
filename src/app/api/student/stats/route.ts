import { NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await requireAuth(['student']);
    
    const supabase = createClient();
    
    // Get max completed lesson order
    const { data: maxCompletedProgress } = await supabase
      .from('progress_entries')
      .select('lessons!inner("order")')
      .eq('student_id', user.user_id)
      .eq('completed', true)
      .order('lessons."order"', { ascending: false })
      .limit(1);
    
    const maxCompletedOrder = (maxCompletedProgress as Array<{ lessons: { order: number } }>)?.[0]?.lessons?.order || 0;
    
    const progressDataResult = await supabase
      .from('progress_entries')
      .select(`
        completed,
        lesson_id,
        lessons!inner(course_id, week_number, class_number, title, "order")
      `)
      .eq('student_id', user.user_id)
      .order('lessons.order', { ascending: true });
    
    const progressData = progressDataResult.data as Array<{ 
      completed: boolean; 
      lesson_id: string; 
      time_spent: number;
      lessons: { course_id: string; week_number: number; class_number: number; title: string; order: number } 
    }> | null;
    
    const [
      { data: assignments },
      { data: certificates },
      { data: currentLesson },
    ] = await Promise.all([
      supabase
        .from('assignments')
        .select('grade, status')
        .eq('student_id', user.user_id),
      supabase
        .from('certificates')
        .select('id')
        .eq('student_id', user.user_id),
      supabase
        .from('lessons')
        .select('id, course_id, week_number, class_number, title, "order"')
        .eq('is_published', true)
        .gt('"order"', maxCompletedOrder)
        .order('"order"', { ascending: true })
        .limit(1),
    ]);
    
    const assignmentsData = assignments as Array<{ grade: number | null; status: string }> | null;
    
    const completedLessons = progressData?.filter(p => p.completed).length || 0;
    const totalLessons = progressData?.length || 8;
    
    const gradedAssignments = assignmentsData?.filter(a => a.grade !== null) || [];
    const averageScore = gradedAssignments.length > 0
      ? Math.round(gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length)
      : 0;
    
    const totalStudyTime = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
    
    // Calculate streak (simplified)
    const currentStreak = calculateStreak(progressData || []);
    
    // Determine current week/class
    const currentProgress = progressData?.find(p => !p.completed);
    const currentWeek = currentProgress?.lessons?.week_number || 1;
    const currentClass = currentProgress?.lessons?.class_number || 1;
    
    const stats = {
      current_streak: currentStreak,
      total_study_time: totalStudyTime,
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
      average_score: averageScore,
      current_week: currentWeek,
      current_class: currentClass,
      next_class: currentProgress?.lessons || null,
      certificates_earned: certificates?.length || 0,
    };
    
    return NextResponse.json(createApiResponse(stats));
  } catch (error) {
    console.error('Student stats error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}

function calculateStreak(progressEntries: any[]): number {
  if (!progressEntries.length) return 0;
  
  const completedDates = progressEntries
    .filter(p => p.completed && p.completed_at)
    .map(p => new Date(p.completed_at).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (!completedDates.length) return 0;
  
  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // Check if there's activity today or yesterday
  const hasRecentActivity = completedDates[0] === today || completedDates[0] === yesterday;
  if (!hasRecentActivity) return 0;
  
  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i - 1]);
    const currDate = new Date(completedDates[i]);
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
    
    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      break;
    }
  }
  
  return streak;
}