import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, Target, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    icon: BookOpen,
    title: 'Cursos Personalizados',
    description: 'Planes de estudio adaptados a tu nivel y objetivos, con seguimiento semanal de tu progreso.',
  },
  {
    icon: Users,
    title: 'Docentes Expertos',
    description: 'Aprende con instructores certificados que te guiarán en cada paso de tu aprendizaje.',
  },
  {
    icon: Target,
    title: 'Metodología Práctica',
    description: 'Enfoque comunicativo con ejercicios reales, role-plays y situaciones cotidianas.',
  },
  {
    icon: Award,
    title: 'Certificación Oficial',
    description: 'Obtén certificados verificables al completar cada nivel del programa.',
  },
  {
    icon: Shield,
    title: 'Acceso Seguro',
    description: 'Sistema de tokens controlado por tu docente para garantizar la calidad del aprendizaje.',
  },
  {
    icon: Star,
    title: 'Progreso Medible',
    description: 'Dashboard completo con métricas de avance, tiempo de estudio y áreas de mejora.',
  },
];

const courseOutline = [
  { week: 'Semana 1', title: 'Información Personal y Inglés Cotidiano', classes: ['Presentaciones', 'Rutinas Diarias'] },
  { week: 'Semana 2', title: 'Describiendo Personas y Lugares', classes: ['Describir Personas', 'Describir Lugares'] },
  { week: 'Semana 3', title: 'Experiencias Pasadas y Comunicación Práctica', classes: ['Hablar del Pasado', 'Situaciones Cotidianas'] },
  { week: 'Semana 4', title: 'Planes Futuros y Práctica Final', classes: ['Planes Futuros', 'Repaso y Evaluación'] },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white dark:from-primary-900/20 dark:via-gray-950 dark:to-gray-950 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Nuevo: Programa de 4 semanas - 8 clases
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl mb-6">
              Aprende a entender y hablar{' '}
              <span className="text-primary-600 dark:text-primary-400">inglés con confianza</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Plataforma educativa completa para docentes y estudiantes. Clases estructuradas, seguimiento de progreso, 
              tareas, certificados y acceso controlado por tokens.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=teacher">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Comenzar como Docente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register?role=student">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Registrarse como Estudiante
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl dark:bg-primary-900/20" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent-200/30 blur-3xl dark:bg-accent-900/20" />
        </div>
      </section>

      {/* Course Program Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
              Programa de Estudio: One-Month English Study
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Curso intensivo de 4 semanas con 8 clases diseñadas para desarrollar habilidades de comunicación en inglés
              a través de actividades prácticas enfocadas en speaking, listening, vocabulario, gramática, reading y writing.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {courseOutline.map((week) => (
              <Card key={week.week} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader className="bg-primary-50 dark:bg-primary-900/20">
                  <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 mb-2">
                    <span className="font-bold">{week.week}</span>
                  </div>
                  <CardTitle className="text-lg">{week.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {week.classes.map((cls, i) => (
                      <li key={cls} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-medium dark:bg-primary-900/30 dark:text-primary-300">
                          {i + 1}
                        </span>
                        <span>Clase {i + 1}: {cls}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
              Todo lo que necesitas para enseñar y aprender
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Herramientas completas para docentes y estudiantes en una plataforma moderna y fácil de usar.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Teachers Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Panel completo para docentes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Gestiona tus cursos, estudiantes y contenido desde un solo lugar. Controla quién accede a tus materiales
                con un sistema de tokens seguro y flexible.
              </p>
              <ul className="space-y-4">
                {[
                  'Crear y editar cursos con lecciones estructuradas',
                  'Generar y revocar tokens de acceso para estudiantes',
                  'Ver progreso detallado de cada estudiante',
                  'Crear tareas y evaluar entregas',
                  'Emitir certificados verificables',
                  'Subir materiales: PDFs, videos, audios',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-1">
                <div className="h-full bg-gray-950 rounded-[inherit] p-6 font-mono text-sm text-green-400 overflow-auto">
                  <pre>{`// Panel de Docente - NextSpeak
const dashboard = {
  students: 24,
  activeTokens: 18,
  courses: 3,
  lessons: 24,
  completionRate: 87%
};

// Generar token de acceso
const token = generateToken({
  studentEmail: 'valeria@email.com',
  courseId: 'english-month-1',
  expiresIn: '30d'
});

// Ver progreso en tiempo real
const progress = await getStudentProgress(studentId);
// { completed: 6/8, avgScore: 92%, streak: 12 }`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 p-1">
                <div className="h-full bg-gray-950 rounded-[inherit] p-6 font-mono text-sm text-green-400 overflow-auto">
                  <pre>{`// Panel de Estudiante - NextSpeak
const myProgress = {
  currentWeek: 3,
  currentClass: 5,
  completedLessons: 4,
  totalLessons: 8,
  averageScore: 89,
  studyTime: '4h 32m',
  streak: 7
};

// Próxima clase
const nextClass = {
  title: 'Talking About the Past',
  week: 3,
  class: 5,
  topics: ['Simple Past', 'Regular/Irregular Verbs']
};

// Mis certificados
const certificates = [
  { name: 'English Basics', verified: true }
];`}</pre>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Experiencia de aprendizaje inmersiva
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Accede a tus lecciones, completa tareas, toma notas y obtén certificados. Todo sincronizado
                entre dispositivos con soporte offline (PWA).
              </p>
              <ul className="space-y-4">
                {[
                  'Ver lecciones con contenido multimedia',
                  'Marcar lecciones como completadas',
                  'Entregar tareas: escritura, audio, video',
                  'Tomar notas privadas por lección',
                  'Ver progreso y rachas de estudio',
                  'Descargar certificados verificables',
                  'Funciona offline como app nativa (PWA)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary-600 dark:bg-primary-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white sm:text-4xl mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a NextSpeak hoy y transforma la forma en que enseñas o aprendes inglés.
            Regístrate gratis y explora todas las funcionalidades.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=teacher">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                Crear cuenta de Docente
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register?role=student">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-primary-500">
                Registrarse como Estudiante
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2" aria-label="NextSpeak Home">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
                  <span className="text-white font-bold text-lg">NS</span>
                </div>
                <span className="font-display font-bold text-xl text-gray-900 dark:text-white">NextSpeak</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Aprende a entender y hablar inglés con confianza.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li><Link href="/courses" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Cursos</Link></li>
                <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Iniciar sesión</Link></li>
                <li><Link href="/register" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Registrarse</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Privacidad</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Términos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>Oldemar Almengor</li>
                <li>Docente de Inglés</li>
                <li>nextspeak@example.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} NextSpeak. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}