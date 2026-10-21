'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Award, TrendingUp, Clock, Target, Loader2, ChevronRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useAuthStore } from '@/hooks/useAuth';
import { formatTime, calculateProgress, getInitials } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/Layout';

interface DashboardStats {
  // Teacher stats
  total_students?: number;
  active_students?: number;
  total_courses?: number;
  total_lessons?: number;
  average_completion_rate?: number;
  tokens_issued?: number;
  tokens_active?: number;
  tokens_revoked?: number;
  // Student stats
  current_streak?: number;
  total_study_time?: number;
  completed_lessons?: number;
  total_lessons_student?: number;
  average_score?: number;
  current_week?: number;
  current_class?: number;
  next_class?: any;
  certificates_earned?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchStats();
    }
  }, [user, authLoading, router]);
  
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const endpoint = user?.role === 'teacher' ? '/api/teacher/stats' : '/api/student/stats';
      const response = await fetch(endpoint, { credentials: 'include' });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Error al cargar estadísticas');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!user) return null;
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchStats} className="mt-4">Reintentar</Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Hola, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user.role === 'teacher' 
                ? 'Gestiona tus cursos y estudiantes desde aquí'
                : 'Continúa tu aprendizaje de inglés hoy'}
            </p>
          </div>
          {user.role === 'teacher' && (
            <Button asChild>
              <a href="/teacher/students">
                <Users className="mr-2 h-4 w-4" />
                Gestionar Estudiantes
              </a>
            </Button>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {user.role === 'teacher' ? (
          <>
            <StatCard
              icon={Users}
              title="Estudiantes Totales"
              value={stats?.total_students || 0}
              subtitle={`${stats?.active_students || 0} activos`}
              color="blue"
            />
            <StatCard
              icon={BookOpen}
              title="Cursos Creados"
              value={stats?.total_courses || 0}
              subtitle={`${stats?.total_lessons || 0} lecciones totales`}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              title="Tasa Completación"
              value={`${stats?.average_completion_rate || 0}%`}
              subtitle="Promedio de todos los estudiantes"
              color="purple"
            />
            <StatCard
              icon={Shield}
              title="Tokens Activos"
              value={stats?.tokens_active || 0}
              subtitle={`${stats?.tokens_issued || 0} emitidos • ${stats?.tokens_revoked || 0} revocados`}
              color="orange"
            />
          </>
        ) : (
          <>
            <StatCard
              icon={Target}
              title="Racha Actual"
              value={`${stats?.current_streak || 0} días`}
              subtitle="¡Sigue así!"
              color="orange"
            />
            <StatCard
              icon={Clock}
              title="Tiempo de Estudio"
              value={formatTime(stats?.total_study_time || 0)}
              subtitle="Total acumulado"
              color="blue"
            />
            <StatCard
              icon={BookOpen}
              title="Progreso del Curso"
              value={`${stats?.completed_lessons || 0}/${stats?.total_lessons_student || 8}`}
              subtitle={`${calculateProgress(stats?.completed_lessons || 0, stats?.total_lessons_student || 8)}% completado`}
              color="green"
            />
            <StatCard
              icon={Award}
              title="Promedio de Notas"
              value={`${stats?.average_score || 0}%`}
              subtitle={`${stats?.certificates_earned || 0} certificados`}
              color="purple"
            />
          </>
        )}
      </div>
      
      {/* Progress Section for Students */}
      {user.role === 'student' && stats && (
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tu Progreso en el Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Semana {stats.current_week || 1} - Clase {stats.current_class || 1}</span>
                  <Badge variant="info">{calculateProgress(stats.completed_lessons || 0, stats.total_lessons || 8)}%</Badge>
                </div>
                <Progress value={calculateProgress(stats.completed_lessons || 0, stats.total_lessons || 8)} className="h-3" />
                
                <div className="space-y-3">
                  {Array.from({ length: 4 }, (_, i) => i + 1).map((week) => (
                    <WeekProgressKey week={week} stats={stats} key={week} />
                  ))}
                </div>
                
                {stats.next_class && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href={`/courses/${stats.next_class.course_id}/lessons/${stats.next_class.id}`}>
                      Continuar: {stats.next_class.title}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Logros y Certificados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.certificates_earned && stats.certificates_earned > 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: stats.certificates_earned }, (_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Certificado #{i + 1}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Verificado y descargable</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Aún no has obtenido certificados</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Completa el curso para ganar tu primer certificado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accesos Rápidos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {user.role === 'teacher' ? (
            teacherQuickActions.map((action) => (
              <QuickActionCard key={action.href} {...action} />
            ))
          ) : (
            studentQuickActions.map((action) => (
              <QuickActionCard key={action.href} {...action} />
            ))
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>La actividad reciente aparecerá aquí conforme uses la plataforma</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string | number; 
  subtitle: string; 
  color: 'blue' | 'green' | 'purple' | 'orange'; 
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeekProgressKey({ week, stats }: { week: number; stats: DashboardStats }) {
  const weekClasses = [1, 2].map(classNum => {
    const lessonNumber = (week - 1) * 2 + classNum;
    const isCompleted = (stats.completed_lessons || 0) >= lessonNumber;
    const isCurrent = stats.current_week === week && stats.current_class === classNum;
    const isFuture = (stats.completed_lessons || 0) + 1 < lessonNumber;
    
    return (
      <div key={classNum} className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
          isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
          isCurrent ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 ring-2 ring-primary-500' :
          'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
        }`}>
          {isCompleted ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          ) : classNum}
        </div>
        <span className={`text-sm ${isCurrent ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
          Clase {lessonNumber}
        </span>
      </div>
    );
  });
  
  return (
    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <p className="font-medium text-sm mb-2">Semana {week}</p>
      <div className="space-y-2">{weekClasses}</div>
    </div>
  );
}

function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  variant = 'outline' 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  href: string; 
  variant?: 'default' | 'outline'; 
}) {
  return (
    <Button asChild variant={variant} className="h-auto p-4 text-left hover:shadow-md transition-shadow">
      <a href={href}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
      </a>
    </Button>
  );
}

const teacherQuickActions = [
  { icon: Users, title: 'Estudiantes', description: 'Gestiona tokens y ve progreso', href: '/teacher/students' },
  { icon: BookOpen, title: 'Mis Cursos', description: 'Crea y edita tus cursos', href: '/courses' },
  { icon: Award, title: 'Certificados', description: 'Emite certificados a estudiantes', href: '/certificates' },
  { icon: TrendingUp, title: 'Analytics', description: 'Ver estadísticas detalladas', href: '/analytics' },
];

const studentQuickActions = [
  { icon: BookOpen, title: 'Mis Lecciones', description: 'Ver y continuar tus clases', href: '/courses' },
  { icon: Award, title: 'Certificados', description: 'Ver y descargar tus certificados', href: '/certificates' },
  { icon: TrendingUp, title: 'Mi Progreso', description: 'Estadísticas detalladas de estudio', href: '/progress' },
  { icon: Users, title: 'Contactar Docente', description: 'Enviar mensaje a tu instructor', href: '/messages' },
];