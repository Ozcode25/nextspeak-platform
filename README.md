# NextSpeak - Plataforma Educativa de Inglés

Plataforma completa para docentes y estudiantes de inglés con gestión de cursos, seguimiento de progreso, tokens de acceso, tareas y certificados.

## 🚀 Características Principales

### Para Docentes
- **Panel de control** con estadísticas en tiempo real
- **Gestión de estudiantes** - Ver progreso, actividad, tokens
- **Sistema de tokens** - Generar/revocar acceso a cursos
- **Editor de cursos** - Crear lecciones con contenido multimedia
- **Tareas y evaluaciones** - Crear, revisar y calificar entregas
- **Certificados** - Emitir certificados verificables
- **Analytics** - Métricas de completación, tiempo, puntuaciones

### Para Estudiantes
- **Dashboard personal** - Progreso, rachas, certificados
- **Cursos estructurados** - Lecciones semanales con contenido rico
- **Seguimiento de progreso** - Marcar lecciones, ver estadísticas
- **Entrega de tareas** - Texto, audio, video, archivos
- **Notas privadas** - Por lección
- **Certificados verificables** - Descargables con código QR
- **PWA** - Instalable como app nativa, funciona offline

### Técnico
- **Next.js 14** con App Router y TypeScript
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **JWT Authentication** con refresh tokens
- **Tailwind CSS** + Radix UI + shadcn/ui
- **Zustand** para estado global
- **React Query** para data fetching
- **PWA** con next-pwa (Workbox)
- **Deploy en Vercel** optimizado

## 📋 Requisitos Previos

- Node.js 18+
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) (para deploy)

## ⚙️ Instalación

### 1. Clonar e instalar dependencias

```bash
cd nextspeak-platform
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
cp .env.example .env.local
```

Variables requeridas:
```env
# Supabase (obtén en Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# JWT (genera uno seguro: openssl rand -base64 32)
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NextSpeak
```

### 3. Configurar base de datos en Supabase

1. Ve a **SQL Editor** en Supabase
2. Ejecuta el contenido de `supabase-schema.sql`
3. Esto creará todas las tablas, índices, políticas RLS y funciones

### 4. Configurar Auth en Supabase

En **Authentication > Settings**:
- Deshabilita "Enable email confirmations" (para desarrollo)
- Configura **Site URL**: `http://localhost:3000`
- Agrega **Redirect URLs**: `http://localhost:3000/**`

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🗂️ Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   │   ├── auth/          # Login, register, logout, refresh
│   │   ├── teacher/       # Dashboard, students, tokens
│   │   ├── student/       # Stats, courses
│   │   ├── courses/       # CRUD cursos
│   │   ├── lessons/       # CRUD lecciones
│   │   ├── tokens/        # Gestión de tokens
│   │   ├── assignments/   # Tareas
│   │   ├── progress/      # Progreso
│   │   └── certificates/  # Certificados
│   ├── dashboard/         # Dashboard principal
│   ├── courses/           # Vista de cursos
│   ├── teacher/           # Panel docente
│   ├── certificates/      # Certificados estudiante
│   ├── login/             # Login
│   ├── register/          # Registro
│   └── verify/            # Verificación certificados
├── components/
│   ├── ui/                # Componentes base (Button, Card, etc.)
│   ├── layout/            # Header, Footer, Layouts
│   ├── teacher/           # Componentes específicos docente
│   ├── student/           # Componentes específicos estudiante
│   ├── auth/              # Formularios auth
│   └── course/            # Componentes de curso
├── hooks/                 # Custom hooks (useAuth, useApi, useToast)
├── lib/                   # Utilidades (auth, supabase, utils)
├── types/                 # TypeScript types
└── styles/                # Estilos globales
```

## 📚 Curso Incluido: "One-Month English Study"

El proyecto incluye el curso completo de 4 semanas / 8 clases:

| Semana | Tema | Clases |
|--------|------|--------|
| 1 | Información Personal y Inglés Cotidiano | Presentaciones, Rutinas Diarias |
| 2 | Describiendo Personas y Lugares | Describir Personas, Describir Lugares |
| 3 | Experiencias Pasadas y Comunicación Práctica | Hablar del Pasado, Situaciones Cotidianas |
| 4 | Planes Futuros y Práctica Final | Planes Futuros, Repaso y Evaluación |

Cada lección incluye:
- Temas y vocabulario
- Actividades prácticas
- Tareas para casa
- Recursos multimedia
- Ejercicios interactivos

## 🔐 Sistema de Tokens

Los docentes controlan el acceso mediante tokens:

```
Formato: NSK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (32 chars)
- Un uso por defecto (configurable)
- Expiración configurable (30 días por defecto)
- Revocables en cualquier momento
- Vinculados a un curso específico
```

## 📱 PWA (Progressive Web App)

La app es instalable:
- `npm run build` genera service worker
- Funciona offline (cache first)
- Instalable en iOS/Android/Desktop
- Notificaciones push (futuro)

## 🚀 Deploy en Vercel

### 1. Push a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tuusuario/nextspeak.git
git push -u origin main
```

### 2. Importar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repo
3. Configura variables de entorno (las mismas que `.env.local`)
4. Deploy

### 3. Configurar dominios personalizados (opcional)

En Vercel > Settings > Domains agrega tu dominio.

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Tests (cuando se agreguen)
npm test
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## 🔧 Personalización

### Colores (tailwind.config.ts)
```typescript
colors: {
  primary: { ... },    // Azul NextSpeak
  secondary: { ... },  // Púrpura
  accent: { ... },     // Naranja
}
```

### Logo
Reemplaza `public/logo.png` con tu logo (recomendado 512x512, PNG transparente)

### Curso
Edita `supabase-schema.sql` o usa el panel de docente para crear cursos personalizados.

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

- Email: soporte@nextspeak.com
- Issues: [GitHub Issues](https://github.com/tuusuario/nextspeak/issues)

---

**NextSpeak** - Aprende a entender y hablar inglés con confianza 🎓