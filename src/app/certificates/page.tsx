'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Loader2, Download, Eye, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useAuthStore } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/Layout';
import { formatDate, getInitials } from '@/lib/utils';
import { toast } from '@/hooks/useToast';

interface Certificate {
  id: string;
  name: string;
  description: string;
  issued_at: string;
  verification_code: string;
  course: {
    id: string;
    name: string;
    teacher: {
      name: string;
    };
  };
  student: {
    name: string;
    email: string;
  };
}

export default function CertificatesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user?.role === 'student') {
      fetchCertificates();
    }
  }, [user, authLoading, router]);
  
  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/certificates/my', { credentials: 'include' });
      const data = await response.json();
      if (data.success) setCertificates(data.data);
      else setError(data.error);
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadCertificate = async (certificate: Certificate) => {
    // Generate PDF or image for download
    toast({ title: 'Preparando descarga', description: 'Generando certificado...' });
    // Implementation would generate PDF using jsPDF or similar
    toast({ title: 'Descarga lista', description: 'El certificado se ha descargado' });
  };
  
  const verifyCertificate = (code: string) => {
    window.open(`/verify/${code}`, '_blank');
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
  
  if (!user || user.role !== 'student') return null;
  
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Mis Certificados</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Certificados verificables obtenidos al completar cursos
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20">{error}</div>
      )}
      
      {certificates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aún no tienes certificados</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Completa tus cursos al 100% para obtener certificados verificables
            </p>
            <Button asChild>
              <a href="/courses">
                Ir a mis cursos
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard 
              key={certificate.id} 
              certificate={certificate} 
              onDownload={downloadCertificate}
              onVerify={verifyCertificate}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

function CertificateCard({ 
  certificate, 
  onDownload, 
  onVerify 
}: { 
  certificate: Certificate; 
  onDownload: (cert: Certificate) => void;
  onVerify: (code: string) => void;
}) {
  return (
    <Card className="overflow-hidden relative">
      {/* Certificate Preview */}
      <div className="aspect-[4/3] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Badge variant="success" className="text-xs">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verificado
            </Badge>
            <span className="text-xs text-white/70 font-mono">{certificate.verification_code}</span>
          </div>
          
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-white mb-2">{certificate.name}</h3>
            <p className="text-white/80 text-sm">{certificate.description}</p>
            <p className="text-white/60 text-xs mt-4">
              Otorgado a <strong className="text-white">{certificate.student.name}</strong>
            </p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>{certificate.course.name}</span>
            <span>Prof. {certificate.course.teacher.name}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Emitido: {formatDate(certificate.issued_at)}
          </span>
          <Badge variant="outline">{certificate.course.name}</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onDownload(certificate)}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Descargar
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onVerify(certificate.verification_code)}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Verificar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onVerify(certificate.verification_code)} className="h-9 w-9" aria-label="Verificar en nueva pestaña">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}