import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createApiResponse } from '@/lib/auth';
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const user = await requireAuth(['student']);
    const { lessonId } = await params;
    
    const supabase = createClient();
    
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('student_id', user.user_id)
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(createApiResponse(notes || []));
  } catch (error) {
    console.error('Get notes error:', error);
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
    const user = await requireAuth(['student']);
    const { lessonId } = await params;
    const { content, is_private } = await request.json();
    
    if (!content) {
      return NextResponse.json(createApiResponse('El contenido es requerido'), { status: 400 });
    }
    
    const supabase = createClient();
    
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        student_id: user.user_id,
        lesson_id: lessonId,
        content,
        is_private: is_private || false,
      } as any)
      .select()
      .single();
    
    if (error || !note) {
      return NextResponse.json(createApiResponse('Error al crear nota'), { status: 500 });
    }
    
    return NextResponse.json(createApiResponse(note), { status: 201 });
  } catch (error) {
    console.error('Create note error:', error);
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    if (error instanceof Error && error.message === 'No autorizado') {
      return NextResponse.json(createApiResponse('No autorizado'), { status: 403 });
    }
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}