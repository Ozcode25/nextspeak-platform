import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUserLastLogin } from '@/lib/db-server';
import { verifyPassword, generateAccessToken, generateRefreshToken, setAuthCookies, createApiResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(createApiResponse('Email y contraseña son requeridos'), { status: 400 });
    }
    
    const { data: user, error } = await getUserByEmail(email);
    
    if (error || !user) {
      return NextResponse.json(createApiResponse('Credenciales inválidas'), { status: 401 });
    }
    
    const userData = user as { is_active: boolean; password_hash: string; id: string; email: string; role: string; name: string; avatar_url: string | null; created_at: string; updated_at: string; last_login: string | null; bio: string | null; specialties: string[] | null };
    
    if (!userData.is_active) {
      return NextResponse.json(createApiResponse('Cuenta desactivada. Contacte al administrador.'), { status: 403 });
    }
    
    const isValid = await verifyPassword(password, userData.password_hash);
    if (!isValid) {
      return NextResponse.json(createApiResponse('Credenciales inválidas'), { status: 401 });
    }
    
    const accessToken = generateAccessToken({
      user_id: userData.id,
      email: userData.email,
      role: userData.role as 'teacher' | 'student',
    });
    
    const refreshToken = generateRefreshToken({
      user_id: userData.id,
      email: userData.email,
      role: userData.role as 'teacher' | 'student',
      token_version: 1,
    });
    
    await setAuthCookies(accessToken, refreshToken);
    
    await updateUserLastLogin(userData.id);
    
    const { password_hash, ...userWithoutPassword } = userData;
    
    return NextResponse.json(createApiResponse({
      user: userWithoutPassword,
      access_token: accessToken,
      refresh_token: refreshToken,
    }));
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}