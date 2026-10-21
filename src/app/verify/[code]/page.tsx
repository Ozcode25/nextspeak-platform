'use client';

import { useEffect, useState } from 'react';
import { Award, CheckCircle, Loader2, XCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface VerificationData {
  verification_code: string;
  student_name: string;
  student_email: string;
  course_name: string;
  teacher_name: string;
  issued_at: string;
  name: string;
  description: string;
}

export default function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const [data, setData] = useState<VerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    verifyCertificate();
  }, []);
  
  const verifyCertificate = async () => {
    try {
      const { code } = await params;
      const response = await fetch(`/api/certificates/verify/${code.toUpperCase()}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else if (response.status === 404) {
        setNotFound(true);
      } else {
        setError(result.error || 'Error al verificar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verificando certificado...</p>
        </div>
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Certificado No Encontrado</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              El código de verificación ingresado no coincide con ningún certificado emitido.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Verifica que el código sea correcto (formato: NSK-XXXXXXXX)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'No se pudo verificar el certificado'}</p>
            <Button onClick={verifyCertificate}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-950">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4">
            <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Certificado Verificado ✓</CardTitle>
          <p className="text-gray-500 dark:text-gray-400">Este certificado es auténtico y fue emitido por NextSpeak</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{data.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{data.description}</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estudiante</p>
              <p className="font-medium text-gray-900 dark:text-white">{data.student_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{data.student_email}</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Curso</p>
              <p className="font-medium text-gray-900 dark:text-white">{data.course_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Instructor: {data.teacher_name}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Badge variant="success" className="text-sm">
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Válido
              </Badge>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{data.verification_code}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Emitido: {formatDate(data.issued_at)}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <a href={`/${data.verification_code}.pdf`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Ver PDF
              </a>
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigator.clipboard.writeText(data.verification_code)}>
              Copiar Código
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}