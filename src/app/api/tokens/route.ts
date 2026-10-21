import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse, generateToken } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(['teacher']);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const supabase = createClient();
    
    const { data: tokens, error, count } = await supabase
      .from('tokens')
      .select(`
        *,
        courses(name),
        students:users!tokens_student_id_fkey(id, name, email)
      `, { count: 'exact' })
      .eq('teacher_id', user.user_id)
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const tokensData = tokens as Array<{ 
      expires_at: string; 
      is_revoked: boolean; 
      max_uses: number; 
      used_count: number;
    }> | null;
    
    const tokensWithStatus = tokensData?.map(token => ({
      ...token,
      is_expired: new Date(token.expires_at) < new Date(),
      is_active: !token.is_revoked && new Date(token.expires_at) > new Date(),
      uses_remaining: token.max_uses - token.used_count,
    })) || [];
    
    return NextResponse.json(createApiResponse({
      data: tokensWithStatus,
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }));
  } catch (error) {
    console.error('Get tokens error:', error);
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
    const { student_email, student_name, course_id, expires_in_days, max_uses } = await request.json();
    
    if (!student_email || !student_name || !course_id || !expires_in_days) {
      return NextResponse.json(createApiResponse('Todos los campos son requeridos'), { status: 400 });
    }
    
    const supabase = createClient();
    
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', course_id)
      .eq('teacher_id', user.user_id)
      .single();
    
    if (courseError || !course) {
      return NextResponse.json(createApiResponse('Curso no encontrado'), { status: 404 });
    }
    
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);
    
    const { data: newToken, error } = await supabase
      .from('tokens')
      .insert({
        token,
        teacher_id: user.user_id,
        student_email: student_email.toLowerCase(),
        student_name,
        course_id,
        expires_at: expiresAt.toISOString(),
        max_uses: max_uses || 1,
        used_count: 0,
        is_revoked: false,
      } as any)
      .select()
      .single();
    
    if (error || !newToken) {
      return NextResponse.json(createApiResponse('Error al crear token'), { status: 500 });
    }
    
    return NextResponse.json(createApiResponse(newToken), { status: 201 });
  } catch (error) {
    console.error('Create token error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}