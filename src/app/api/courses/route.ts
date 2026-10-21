import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(['teacher']);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const supabase = createClient();
    
    const { data: courses, error, count } = await supabase
      .from('courses')
      .select(`
        *,
        lessons(count)
      `, { count: 'exact' })
      .eq('teacher_id', user.user_id)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const coursesWithStats = (courses as Array<{ lessons: Array<{ count: number }> }>)?.map(course => ({
      ...course,
      lessons_count: course.lessons?.[0]?.count || 0,
    })) || [];
    
    return NextResponse.json(createApiResponse({
      data: coursesWithStats,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }));
  } catch (error) {
    console.error('Get courses error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(['teacher']);
    const courseData = await request.json();
    
    const supabase = createClient();
    
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        ...courseData,
        teacher_id: user.user_id,
        total_classes: courseData.duration_weeks * courseData.classes_per_week,
      })
      .select()
      .single();
    
    if (error || !course) {
      return NextResponse.json(createApiResponse('Error al crear curso'), { status: 500 });
    }
    
    return NextResponse.json(createApiResponse(course), { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}