import { NextResponse } from 'next/server';
import { getRefreshToken, verifyRefreshToken, generateAccessToken, generateRefreshToken, setAuthCookies, createApiResponse } from '@/lib/auth';

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return NextResponse.json(createApiResponse('No hay token de refresco'), { status: 401 });
    }
    
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(createApiResponse('Token de refresco inválido o expirado'), { status: 401 });
    }
    
    const newAccessToken = generateAccessToken({
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
    });
    
    const newRefreshToken = generateRefreshToken({
      user_id: payload.user_id,
      email: payload.email,
      role: payload.role,
      token_version: payload.token_version + 1,
    });
    
    await setAuthCookies(newAccessToken, newRefreshToken);
    
    return NextResponse.json(createApiResponse({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    }));
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}