import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateAccessToken, generateRefreshToken, setAuthCookies, generateToken, createApiResponse } from '@/lib/auth';
import { incrementTokenUsage, emailExists, validateToken, createUser } from '@/lib/db-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, teacher_code } = await request.json();
    
    if (!email || !password || !name || !role) {
      return NextResponse.json(createApiResponse('Todos los campos son requeridos'), { status: 400 });
    }
    
    if (password.length < 8) {
      return NextResponse.json(createApiResponse('La contraseña debe tener al menos 8 caracteres'), { status: 400 });
    }
    
    const exists = await emailExists(email);
    
    if (exists) {
      return NextResponse.json(createApiResponse('El email ya está registrado'), { status: 409 });
    }
    
    const passwordHash = await hashPassword(password);
    
    let teacherId = null;
    let courseId = null;
    let tokenData: { used_count: number; max_uses: number; courses: { teacher_id: string }; course_id: string } | null = null;
    
    if (role === 'student' && teacher_code) {
      const { data: tokenInfo, error: tokenError } = await validateToken(teacher_code);
      
      if (tokenError || !tokenInfo) {
        return NextResponse.json(createApiResponse('Código de invitación inválido o expirado'), { status: 400 });
      }
      
      teacherId = tokenInfo.courses.teacher_id;
      courseId = tokenInfo.course_id;
      tokenData = tokenInfo;
    }
    
    const { data: newUser, error } = await createUser({
      email: email.toLowerCase(),
      name,
      role,
      password_hash: passwordHash,
      is_active: true,
    } as any);
    
    if (error || !newUser) {
      return NextResponse.json(createApiResponse('Error al crear usuario'), { status: 500 });
    }
    
    const newUserData = newUser as { id: string; email: string; role: string; name: string; password_hash: string; avatar_url: string | null; created_at: string; updated_at: string; is_active: boolean; last_login: string | null; bio: string | null; specialties: string[] | null };
    
    if (role === 'student' && courseId && teacher_code && tokenData) {
      await incrementTokenUsage(teacher_code, newUserData.id, newUserData.email, newUserData.name);
    }
    
    const accessToken = generateAccessToken({
      user_id: newUserData.id,
      email: newUserData.email,
      role: newUserData.role as 'teacher' | 'student',
    });
    
    const refreshToken = generateRefreshToken({
      user_id: newUserData.id,
      email: newUserData.email,
      role: newUserData.role as 'teacher' | 'student',
      token_version: 1,
    });
    
    await setAuthCookies(accessToken, refreshToken);
    
    const { password_hash, ...userWithoutPassword } = newUserData;
    
    return NextResponse.json(createApiResponse({
      user: userWithoutPassword,
      access_token: accessToken,
      refresh_token: refreshToken,
    }), { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(createApiResponse('Error interno del servidor'), { status: 500 });
  }
}