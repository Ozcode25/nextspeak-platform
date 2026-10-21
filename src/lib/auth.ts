import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import type { JWTPayload, RefreshTokenPayload, UserRole, ApiResponse } from '@/types';
import { generateToken as generateTokenUtil, generateVerificationCode } from '@/lib/utils';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value;
}

export async function getCurrentUser(): Promise<{ user: JWTPayload; token: string } | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  
  const payload = verifyAccessToken(accessToken);
  if (!payload) return null;
  
  return { user: payload, token: accessToken };
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<JWTPayload> {
  const userData = await getCurrentUser();
  if (!userData) {
    throw new Error('No autenticado');
  }
  
  if (allowedRoles && !allowedRoles.includes(userData.user.role)) {
    throw new Error('No autorizado');
  }
  
  return userData.user;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;
  
  const newAccessToken = generateAccessToken({
    user_id: payload.user_id,
    email: payload.email,
    role: payload.role,
  });
  
  const newRefreshToken = generateRefreshToken({
    user_id: payload.user_id,
    email: payload.email,
    role: payload.role,
    token_version: payload.token_version,
  });
  
  await setAuthCookies(newAccessToken, newRefreshToken);
  
  return newAccessToken;
}

export function createApiResponse<T>(data: T): ApiResponse<T>;
export function createApiResponse<T>(error: string, status?: number): ApiResponse<T>;
export function createApiResponse<T>(dataOrError: T | string, status?: number): ApiResponse<T> {
  if (typeof dataOrError === 'string') {
    return {
      success: false,
      error: dataOrError,
    };
  }
  return {
    success: true,
    data: dataOrError,
  };
}

export { generateTokenUtil as generateToken, generateVerificationCode };