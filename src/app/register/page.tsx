'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, User, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useAuthStore } from '@/hooks/useAuth';
import { toast } from '@/hooks/useToast';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const defaultRole = searchParams.get('role') || 'student';
  const teacherCode = searchParams.get('token') || '';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole as 'teacher' | 'student',
    teacher_code: teacherCode,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  useEffect(() => {
    if (teacherCode) {
      setFormData(prev => ({ ...prev, teacher_code: teacherCode, role: 'student' }));
    }
  }, [teacherCode]);
  
  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (formData.role === 'student' && !formData.teacher_code) {
      newErrors.teacher_code = 'Necesitas un token de acceso de tu docente';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: formData.role,
          teacher_code: formData.teacher_code,
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (data.error?.includes('email')) setErrors({ email: data.error });
        else if (data.error?.includes('token') || data.error?.includes('invitación')) setErrors({ teacher_code: data.error });
        else setErrors({ general: data.error });
        return;
      }
      
      setAuth(data.data.user, data.data.access_token, data.data.refresh_token);
      toast({ 
        title: 'Cuenta creada', 
        description: formData.role === 'teacher' 
          ? 'Bienvenido a NextSpeak. Ahora puedes crear tus cursos.' 
          : 'Bienvenido. Tu docente te dará acceso al curso.' 
      });
      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrors({ general: 'Error de conexión. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Muy débil';
    if (passwordStrength === 2) return 'Débil';
    if (passwordStrength === 3) return 'Media';
    if (passwordStrength === 4) return 'Fuerte';
    return 'Muy fuerte';
  };
  
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center gap-2 justify-center mb-4" aria-label="NextSpeak Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-white font-bold text-lg">NS</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">NextSpeak</span>
          </Link>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            {formData.role === 'teacher' 
              ? 'Regístrate como docente para crear y gestionar tus cursos'
              : 'Regístrate como estudiante con el token de tu docente'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {errors.general && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400" role="alert">
                {errors.general}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tu nombre completo"
                error={errors.name}
                disabled={isLoading}
                autoComplete="name"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
                error={errors.email}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de cuenta</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'teacher' | 'student' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Docente / Instructor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Estudiante</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.role === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="teacher_code">Token de acceso <span className="text-red-500">*</span></Label>
                <Input
                  id="teacher_code"
                  type="text"
                  value={formData.teacher_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, teacher_code: e.target.value.toUpperCase() }))}
                  placeholder="NSK-XXXXXXXX"
                  error={errors.teacher_code}
                  disabled={isLoading}
                  autoComplete="off"
                  helperText="Tu docente te debe proporcionar un token de acceso (ej: NSK-ABC123...)"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    calculatePasswordStrength(e.target.value);
                  }}
                  placeholder="••••••••"
                  error={errors.password}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Fortaleza: {getStrengthLabel()}
                    {passwordStrength < 3 && ' - Añade mayúsculas, números y símbolos'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" loading={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formData.role === 'teacher' ? 'Crear cuenta de Docente' : 'Registrarse como Estudiante'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator>o</Separator>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
          {formData.role === 'teacher' && (
            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
                <div className="text-sm text-primary-800 dark:text-primary-200">
                  <p className="font-medium">Como docente tendrás acceso a:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Crear y gestionar cursos ilimitados</li>
                    <li>Generar tokens para tus estudiantes</li>
                    <li>Ver progreso y estadísticas detalladas</li>
                    <li>Crear tareas y evaluar entregas</li>
                    <li>Emitir certificados verificables</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {formData.role === 'student' && (
            <div className="p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800">
              <div className="flex items-start gap-2">
                <UserPlus className="h-5 w-5 text-accent-600 dark:text-accent-400 mt-0.5 shrink-0" />
                <div className="text-sm text-accent-800 dark:text-accent-200">
                  <p className="font-medium">Como estudiante necesitas:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Un token de acceso de tu docente</li>
                    <li>El token tiene formato: NSK-XXXXXXXX</li>
                    <li>Pide a tu docente que te lo envíe</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}