import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.delete(name);
      },
    },
  });
}

// Helper functions for common operations
export async function getUserByEmail(email: string) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  return { data: data as Database['public']['Tables']['users']['Row'] | null, error };
}

export async function emailExists(email: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();
  return !error && !!data;
}

export async function updateUserLastLogin(userId: string) {
  const supabase = getSupabaseServer();
  // @ts-ignore
  const { error } = await supabase
    .from('users')
    // @ts-ignore
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);
  return { error };
}

export async function validateToken(token: string) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('tokens')
    .select('*, courses!inner(teacher_id)')
    .eq('token', token)
    .eq('is_revoked', false)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (error || !data) return { data: null, error: error || new Error('Token not found') };
  
  const tokenInfo = data as { used_count: number; max_uses: number; courses: { teacher_id: string }; course_id: string };
  
  if (tokenInfo.used_count >= tokenInfo.max_uses) {
    return { data: null, error: new Error('Token max uses reached') };
  }
  
  return { data: tokenInfo, error: null };
}

export async function incrementTokenUsage(token: string, studentId: string, studentEmail: string, studentName: string) {
  const supabase = getSupabaseServer();
  const { data: tokenData, error: fetchError } = await supabase
    .from('tokens')
    .select('used_count')
    .eq('token', token)
    .single();
  
  if (fetchError || !tokenData) return { error: fetchError || new Error('Token not found') };
  
  const token = tokenData as { used_count: number };
  
  const { error } = await supabase
    .from('tokens')
    // @ts-ignore
    .update({
      student_id: studentId,
      student_email: studentEmail,
      student_name: studentName,
      used_count: (tokenData.used_count || 0) + 1,
      last_used_at: new Date().toISOString(),
    })
    .eq('token', token);
  
  return { error };
}

export async function revokeStudentTokens(studentId: string, teacherId: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('tokens')
    .update({
      is_revoked: true,
      revoked_at: new Date().toISOString(),
      revoked_reason: 'Revocado por el docente',
    })
    .eq('student_id', studentId)
    .eq('teacher_id', teacherId)
    .eq('is_revoked', false);
  return { error };
}

export async function deactivateStudent(studentId: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from('users')
    .update({ is_active: false })
    .eq('id', studentId);
  return { error };
}

export async function createUser(userData: Database['public']['Tables']['users']['Insert']) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  return { data, error };
}

export async function getUserById(userId: string) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role, avatar_url, created_at, updated_at, is_active, last_login, bio, specialties')
    .eq('id', userId)
    .single();
  return { data: data as Database['public']['Tables']['users']['Row'] | null, error };
}

export async function getTeacherStats(teacherId: string) {
  const supabase = getSupabaseServer();
  
  const [
    { count: totalStudents },
    { count: activeStudents },
    { count: totalCourses },
    { count: totalLessons },
    { data: tokens },
    { data: progressData },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('teacher_id', teacherId),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('teacher_id', teacherId).eq('is_active', true),
    supabase.from('courses').select('*', { count: 'exact', head: true }).eq('teacher_id', teacherId),
    supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('courses.teacher_id', teacherId),
    supabase.from('tokens').select('*').eq('teacher_id', teacherId),
    supabase.from('progress_entries').select('completed, lesson_id, student_id').eq('lessons.courses.teacher_id', teacherId),
  ]);
  
  const tokensIssued = tokens?.length || 0;
  const tokensActive = tokens?.filter(t => !t.is_revoked && new Date(t.expires_at) > new Date()).length || 0;
  const tokensRevoked = tokens?.filter(t => t.is_revoked).length || 0;
  
  const totalProgressEntries = progressData?.length || 0;
  const completedProgressEntries = progressData?.filter(p => p.completed).length || 0;
  const averageCompletionRate = totalProgressEntries > 0 ? Math.round((completedProgressEntries / totalProgressEntries) * 100) : 0;
  
  return {
    total_students: totalStudents || 0,
    active_students: activeStudents || 0,
    total_courses: totalCourses || 0,
    total_lessons: totalLessons || 0,
    average_completion_rate: averageCompletionRate,
    tokens_issued: tokensIssued,
    tokens_active: tokensActive,
    tokens_revoked: tokensRevoked,
  };
}

export async function getStudentStats(studentId: string) {
  const supabase = getSupabaseServer();
  
  const [
    { data: progressData },
    { data: assignments },
    { data: certificates },
    { data: currentLesson },
  ] = await Promise.all([
    supabase
      .from('progress_entries')
      .select(`
        completed,
        lesson_id,
        lessons!inner(course_id, week_number, class_number, title, "order")
      `)
      .eq('student_id', studentId)
      .order('lessons.order', { ascending: true }),
    supabase
      .from('assignments')
      .select('grade, status')
      .eq('student_id', studentId),
    supabase
      .from('certificates')
      .select('id')
      .eq('student_id', studentId),
    supabase
      .from('lessons')
      .select('id, course_id, week_number, class_number, title, "order"')
      .eq('is_published', true)
      .gt('"order"', (await supabase
        .from('progress_entries')
        .select('lessons!inner("order")')
        .eq('student_id', studentId)
        .eq('completed', true)
        .order('lessons.order', { ascending: false })
        .limit(1)
      ).data?.[0]?.lessons?.order || 0)
      .order('"order"', { ascending: true })
      .limit(1),
  ]);
  
  const completedLessons = progressData?.filter(p => p.completed).length || 0;
  const totalLessons = progressData?.length || 8;
  
  const gradedAssignments = assignments?.filter(a => a.grade !== null) || [];
  const averageScore = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length)
    : 0;
  
  const totalStudyTime = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
  
  const currentStreak = calculateStreak(progressData || []);
  
  const currentProgress = progressData?.find(p => !p.completed);
  const currentWeek = currentProgress?.lessons?.week_number || 1;
  const currentClass = currentProgress?.lessons?.class_number || 1;
  
  return {
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
}

function calculateStreak(progressEntries: { completed: boolean; completed_at: string | null }[]): number {
  if (!progressEntries.length) return 0;
  
  const completedDates = progressEntries
    .filter(p => p.completed && p.completed_at)
    .map(p => new Date(p.completed_at!).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  if (!completedDates.length) return 0;
  
  let streak = 1;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
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