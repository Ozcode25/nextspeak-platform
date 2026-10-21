import { NextResponse } from 'next/server';
import { getCurrentUser, createApiResponse } from '@/lib/auth';
import { getUserById } from '@/lib/db-server';

export async function GET() {
  try {
    const userData = await getCurrentUser();
    if (!userData) {
      return NextResponse.json(createApiResponse('No autenticado'), { status: 401 });
    }
    
    const { data: user, error } = await getUserById(userData.user.user_id);
    
    if (error || !user) {
      return NextResponse.json(createApiResponse('Usuario no encontrado'), { status: 404 });
    }
    
    if (!user.is_active) {
      return NextResponse.json(createApiResponse('Cuenta desactivada'), { status: 403 });
    }
    
    return NextResponse.json(createApiResponse({ user }));
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}