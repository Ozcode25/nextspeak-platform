'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Play, Lock, CheckCircle, Clock, Loader2, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useAuthStore } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/Layout';
import { formatDate, calculateProgress } from '@/lib/utils';

interface Course {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  classes_per_week: number;
  total_classes: number;
  is_published: boolean;
  thumbnail_url: string | null;
  lessons_count: number;
  created_at: string;
}

interface Lesson {
  id: string;
  course_id: string;
  week_number: number;
  class_number: number;
  title: string;
  topics: string[];
  activities: string[];
  homework: string;
  order: number;
  is_published: boolean;
}

interface CourseWithProgress extends Course {
  progress?: {
    completed_lessons: number;
    total_lessons: number;
    percentage: number;
    next_lesson?: Lesson;
  };
}

export default function CoursesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchCourses();
  }, [user, authLoading, router]);
  
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const endpoint = user?.role === 'teacher' ? '/api/courses' : '/api/student/courses';
      const response = await fetch(endpoint, { credentials: 'include' });
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data);
      } else {
        setError(data.error);
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
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              {user.role === 'teacher' ? 'Mis Cursos' : 'Mis Cursos'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user.role === 'teacher' 
                ? 'Gestiona y crea nuevos cursos para tus estudiantes'
                : 'Accede a tus lecciones y continúa tu aprendizaje'}
            </p>
          </div>
          {user.role === 'teacher' && (
            <Button asChild>
              <a href="/courses/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Curso
              </a>
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20">
          {error}
          <Button variant="outline" className="ml-4" onClick={fetchCourses}>Reintentar</Button>
        </div>
      )}
      
      {user.role === 'teacher' ? (
        <TeacherCoursesView courses={courses} onRefresh={fetchCourses} />
      ) : (
        <StudentCoursesView 
          courses={courses} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      )}
    </DashboardLayout>
  );
}

function TeacherCoursesView({ courses, onRefresh }: { courses: Course[]; onRefresh: () => void }) {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tienes cursos aún</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Crea tu primer curso para empezar a enseñar</p>
          <Button asChild>
            <a href="/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Crear Curso
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <CourseCardTeacher key={course.id} course={course} onRefresh={onRefresh} />
      ))}
    </div>
  );
}

function CourseCardTeacher({ course, onRefresh }: { course: Course; onRefresh: () => void }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 shrink-0">
              <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration_weeks} semanas</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course.total_classes} clases</span>
                <span className="flex items-center gap-1">
                  <Badge variant={course.is_published ? 'success' : 'outline'}>
                    {course.is_published ? 'Publicado' : 'Borrador'}
                  </Badge>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <a href={`/courses/${course.id}`}>Ver Lecciones</a>
            </Button>
            <Button asChild>
              <a href={`/courses/${course.id}/edit`}>Editar</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentCoursesView({ courses, activeTab, setActiveTab }: { courses: CourseWithProgress[]; activeTab: 'my' | 'all'; setActiveTab: (tab: 'my' | 'all') => void }) {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Lock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tienes cursos asignados</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Pide a tu docente que te envíe un token de acceso para unirte a un curso
          </p>
          <Button variant="outline" asChild>
            <a href="/dashboard">Volver al Dashboard</a>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full">
        <TabsTrigger value="my" className="flex-1">En Progreso</TabsTrigger>
        <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
      </TabsList>
      <TabsContent value="my" className="mt-6">
        <StudentCourseGrid courses={courses.filter(c => c.progress && c.progress.completed_lessons < c.progress.total_lessons)} />
      </TabsContent>
      <TabsContent value="all" className="mt-6">
        <StudentCourseGrid courses={courses} />
      </TabsContent>
    </Tabs>
  );
}

function StudentCourseGrid({ courses }: { courses: CourseWithProgress[] }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No hay cursos en esta categoría</p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <StudentCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function StudentCourseCard({ course }: { course: CourseWithProgress }) {
  const progress = course.progress;
  const percentage = progress ? calculateProgress(progress.completed_lessons, progress.total_lessons) : 0;
  const isCompleted = progress && progress.completed_lessons >= progress.total_lessons;
  const nextLesson = progress?.next_lesson;
  
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-32 bg-gradient-to-br from-primary-500 to-primary-700">
        {course.thumbnail_url && (
          <img 
            src={course.thumbnail_url} 
            alt="" 
            className="h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 flex items-end p-4">
          <Badge variant={isCompleted ? 'success' : 'default'} className="text-sm">
            {isCompleted ? 'Completado' : `${percentage}%`}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{course.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{course.description}</p>
        
        <Progress value={percentage} className="mb-3" />
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>{progress?.completed_lessons || 0}/{progress?.total_lessons || course.total_classes} lecciones</span>
          <span>{course.duration_weeks} semanas</span>
        </div>
        
        {nextLesson && (
          <Button variant="outline" className="w-full" asChild>
            <a href={`/courses/${course.id}/lessons/${nextLesson.id}`}>
              <Play className="mr-2 h-4 w-4" />
              Continuar: {nextLesson.title}
            </a>
          </Button>
        )}
        {isCompleted && (
          <Button variant="default" className="w-full" asChild>
            <a href={`/certificates?course=${course.id}`}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Ver Certificado
            </a>
          </Button>
        )}
        {!nextLesson && !isCompleted && (
          <Button variant="outline" className="w-full" disabled>
            <Lock className="mr-2 h-4 w-4" />
            Esperando lección anterior
          </Button>
        )}
      </CardContent>
    </Card>
  );
}