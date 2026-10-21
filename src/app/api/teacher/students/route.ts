import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(['teacher']);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const supabase = createClient();
    
    let query = supabase
      .from('users')
      .select(`
        id, email, name, avatar_url, created_at, updated_at, is_active, last_login,
        progress:progress_entries(completed, lesson_id),
        tokens:tokens(token, is_revoked, expires_at, last_used_at, course_id)
      `, { count: 'exact' })
      .eq('role', 'student')
      .eq('teacher_id', user.user_id);
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    const { data: students, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const studentsData = students as Array<{ 
      progress: Array<{ completed: boolean; lesson_id: string }>;
      tokens: Array<{ token: string; is_revoked: boolean; expires_at: string; last_used_at: string | null; course_id: string }>;
    }> | null;
    
    const studentsWithStats = studentsData?.map(student => {
      const totalLessons = student.progress?.length || 0;
      const completedLessons = student.progress?.filter((p: any) => p.completed).length || 0;
      const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      const activeToken = student.tokens?.find((t: any) => !t.is_revoked && new Date(t.expires_at) > new Date());
      
      return {
        ...student,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        completion_rate: completionRate,
        has_active_token: !!activeToken,
        token_expires_at: activeToken?.expires_at,
        token_last_used: activeToken?.last_used_at,
      };
    }) || [];
    
    return NextResponse.json(createApiResponse({
      data: studentsWithStats,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }));
  } catch (error) {
    console.error('Get students error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}