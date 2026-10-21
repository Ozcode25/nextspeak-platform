'use client';

import { useCallback } from 'react';
import { useAuthStore } from './useAuth';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function useApi() {
  const { accessToken, refreshToken, setTokens, logout } = useAuthStore();
  
  const request = useCallback(async <T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { requireAuth = true, headers, ...fetchOptions } = options;
    
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    if (requireAuth && accessToken) {
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
    
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}${endpoint}`, {
        ...fetchOptions,
        headers: requestHeaders,
        credentials: 'include',
      });
      
      if (response.status === 401 && requireAuth) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
          response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}${endpoint}`, {
            ...fetchOptions,
            headers: requestHeaders,
            credentials: 'include',
          });
        } else {
          logout();
          window.location.href = '/login';
          return { success: false, error: 'Sesión expirada' };
        }
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Error en la solicitud' };
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }, [accessToken, logout]);
  
  const get = useCallback(<T>(endpoint: string, options?: ApiOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }), [request]);
  
  const post = useCallback(<T>(endpoint: string, body: unknown, options?: ApiOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }), [request]);
  
  const put = useCallback(<T>(endpoint: string, body: unknown, options?: ApiOptions) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }), [request]);
  
  const patch = useCallback(<T>(endpoint: string, body: unknown, options?: ApiOptions) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }), [request]);
  
  const del = useCallback(<T>(endpoint: string, options?: ApiOptions) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }), [request]);
  
  return { get, post, put, patch, delete: del };
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.success && data.data?.access_token) {
      return data.data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}