import { NextResponse } from 'next/server';
import { clearAuthCookies, createApiResponse } from '@/lib/auth';

export async function POST() {
  try {
    await clearAuthCookies();
    return NextResponse.json(createApiResponse('Sesión cerrada correctamente'));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(createApiResponse('Error al cerrar sesión'), { status: 500 });
  }
}