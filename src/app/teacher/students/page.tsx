'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Users, Search, Loader2, ChevronRight, Mail, Shield, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { useAuthStore } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/Layout';
import { formatDate, calculateProgress, getInitials, generateToken } from '@/lib/utils';
import { toast } from '@/hooks/useToast';

interface Student {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  last_login: string | null;
  total_lessons: number;
  completed_lessons: number;
  completion_rate: number;
  has_active_token: boolean;
  token_expires_at: string | null;
  token_last_used: string | null;
}

export default function TeacherStudentsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [tokenForm, setTokenForm] = useState({ course_id: '', expires_in_days: 30, max_uses: 1 });
  const [courses, setCourses] = useState<Array<{id: string, name: string}>>([]);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user?.role === 'teacher') {
      fetchStudents();
      fetchCourses();
    }
  }, [user, authLoading, router]);
  
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/teacher/students?search=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) setStudents(data.data.data);
      else setError(data.error);
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses', { credentials: 'include' });
      const data = await response.json();
      if (data.success) setCourses(data.data);
    } catch {
      console.error('Error fetching courses');
    }
  };
  
  const handleRevokeToken = async (studentId: string) => {
    setRevokingId(studentId);
    try {
      const response = await fetch('/api/teacher/revoke-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Token revocado', description: 'El acceso del estudiante ha sido revocado' });
        fetchStudents();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setRevokingId(null);
    }
  };
  
  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_email: selectedStudent?.email,
          student_name: selectedStudent?.name,
          ...tokenForm,
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Token generado', description: `Token: ${data.data.token}` });
        setShowTokenDialog(false);
        fetchStudents();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    }
  };
  
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!user || user.role !== 'teacher') return null;
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Estudiantes</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona el acceso y ve el progreso de tus estudiantes</p>
          </div>
          <Button asChild>
            <a href="/tokens/new">
              <Shield className="mr-2 h-4 w-4" />
              Generar Token
            </a>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Lista de Estudiantes ({students.length})</CardTitle>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20">{error}</div>
          )}
          
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No se encontraron estudiantes' : 'No tienes estudiantes aún'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery ? 'Intenta con otra búsqueda' : 'Genera tokens de acceso para invitar estudiantes'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <a href="/tokens/new">
                    <Shield className="mr-2 h-4 w-4" />
                    Generar Primer Token
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <StudentRow 
                  key={student.id} 
                  student={student} 
                  onRevoke={() => handleRevokeToken(student.id)}
                  onGenerateToken={() => {
                    setSelectedStudent(student);
                    setShowTokenDialog(true);
                  }}
                  revoking={revokingId === student.id}
                  router={router}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Generate Token Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generar Token de Acceso</DialogTitle>
            <DialogDescription>
              Crear un nuevo token para {selectedStudent?.name} ({selectedStudent?.email})
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGenerateToken}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course_id">Curso</Label>
                <select
                  id="course_id"
                  value={tokenForm.course_id}
                  onChange={(e) => setTokenForm(prev => ({ ...prev, course_id: e.target.value }))}
                  className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                  required
                >
                  <option value="">Seleccionar curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires_in_days">Expira en (días)</Label>
                <Input
                  id="expires_in_days"
                  type="number"
                  value={tokenForm.expires_in_days}
                  onChange={(e) => setTokenForm(prev => ({ ...prev, expires_in_days: parseInt(e.target.value) || 30 }))}
                  min={1}
                  max={365}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_uses">Máximo de usos</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={tokenForm.max_uses}
                  onChange={(e) => setTokenForm(prev => ({ ...prev, max_uses: parseInt(e.target.value) || 1 }))}
                  min={1}
                  max={100}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowTokenDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Shield className="mr-2 h-4 w-4" />
                Generar Token
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function StudentRow({ 
  student, 
  onRevoke, 
  onGenerateToken, 
  revoking,
  router
}: { 
  student: Student; 
  onRevoke: () => void; 
  onGenerateToken: () => void; 
  revoking: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={student.avatar_url || ''} alt={student.name} />
          <AvatarFallback name={student.name}>{getInitials(student.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">{student.name}</h4>
            <Badge variant={student.is_active ? 'success' : 'secondary'}>
              {student.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Último acceso: {student.last_login ? formatDate(student.last_login) : 'Nunca'}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Token: {student.has_active_token ? 'Activo' : 'Sin token'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Progress */}
        <div className="hidden md:block w-40">
          <Progress value={student.completion_rate} className="h-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
            {student.completed_lessons}/{student.total_lessons} lecciones
          </p>
        </div>
        
        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/teacher/students/${student.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGenerateToken}>
              <Shield className="mr-2 h-4 w-4" />
              Generar Token
            </DropdownMenuItem>
            {student.has_active_token && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onRevoke} disabled={revoking} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {revoking ? 'Revocar...' : 'Revocar Token'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

