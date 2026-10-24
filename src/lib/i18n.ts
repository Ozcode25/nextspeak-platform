/**
 * i18n for the site chrome only (navigation, buttons, headings, messages).
 *
 * Lesson content, vocabulary, examples, quiz questions and explanations
 * are always English — that is exactly what NextSpeak teaches.
 */

export const LANGS = ['en', 'es'] as const;

export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

export const LANG_STORAGE_KEY = 'nextspeak-lang-v1';

const en = {
  // Header & navigation
  'nav.main': 'Main navigation',
  'nav.home': 'Home',
  'nav.lessons': 'Lessons',
  'nav.progress': 'Progress',
  'menu.open': 'Open menu',
  'menu.close': 'Close menu',
  'lang.label': 'Language',
  'theme.toDark': 'Switch to dark mode',
  'theme.toLight': 'Switch to light mode',

  // Footer
  'footer.tagline':
    'Free beginner English lessons with interactive quizzes. Learn at your own pace, on any device.',
  'footer.learn': 'Learn',
  'footer.allLessons': 'All lessons',
  'footer.myProgress': 'My progress',
  'footer.install': 'Install the app',
  'footer.about': 'About',
  'footer.author': 'Created by Oldemar Almengor, English teacher',
  'footer.privacy': 'Your progress stays on this device — no account, no tracking.',
  'footer.rights': '© {year} NextSpeak. All rights reserved.',

  // Home
  'home.badge': 'Free · No sign-up · {n} beginner lessons',
  'home.heroTitle': 'Learn English with',
  'home.heroAccent': 'confidence',
  'home.heroSubtitle':
    'Short, friendly lessons with real examples and interactive quizzes. Your progress is saved on your own device — start now, continue anytime, anywhere.',
  'home.ctaStart': 'Start learning',
  'home.ctaProgress': 'See my progress',
  'home.statsAria': 'Course facts',
  'home.statLessons': 'beginner lessons',
  'home.statQuestions': 'quiz questions with feedback',
  'home.statFree': 'free, forever',
  'home.howTitle': 'How it works',
  'home.howSubtitle': 'Three simple steps — repeat them at your own pace.',
  'home.step1Title': '1. Pick a lesson',
  'home.step1Text':
    'Start with greetings or jump to any topic — every lesson is beginner friendly.',
  'home.step2Title': '2. Study the content',
  'home.step2Text':
    'Short explanations, real examples, key phrases and a vocabulary list per lesson.',
  'home.step3Title': '3. Take the quiz',
  'home.step3Text':
    'Answer five questions and get instant feedback with clear explanations.',
  'home.featuredTitle': 'Start with these lessons',
  'home.featuredSubtitle': 'From first “hello” to talking about your future plans.',
  'home.viewAll': 'View all lessons',
  'home.weekMin': 'Week {week} · {min} min',
  'home.openLesson': 'Open lesson',
  'home.featuresTitle': 'Made for learning anywhere',
  'home.feature1Title': 'Works on any device',
  'home.feature1Text':
    'Phones, tablets and desktops — the layout adapts automatically and everything is easy to tap.',
  'home.feature2Title': 'Installable as an app',
  'home.feature2Text':
    'Add NextSpeak to your home screen and open it like any native app. No store, no download fees.',
  'home.feature3Title': 'Keeps working offline',
  'home.feature3Text':
    'Lessons you have opened stay available without internet. Your progress is saved on your device.',
  'home.feature4Title': 'Accessible by design',
  'home.feature4Text':
    'Full keyboard support, clear focus states, readable text and screen-reader friendly pages.',
  'home.installTitle': 'Add NextSpeak to your home screen',
  'home.installText':
    'NextSpeak is a Progressive Web App (PWA): install it like a native app and open it in one tap. On most phones and computers your browser offers an install option.',
  'home.installTip1':
    'Android (Chrome): tap “Install NextSpeak” above, or choose “Add to Home screen” in the menu.',
  'home.installTip2': 'iPhone / iPad (Safari): Share → Add to Home Screen.',
  'home.installTip3':
    'Computer (Chrome / Edge): click the install icon in the address bar.',
  'home.installNote':
    'Good to know: lessons are cached after your first visit, so they keep working offline. A first-time visit and future updates need an internet connection.',
  'home.finalTitle': 'Ready to say your first “hello”?',
  'home.finalCta': 'Start the first lesson',

  // Lessons list
  'lessons.title': 'Beginner lessons',
  'lessons.subtitle':
    'Follow the lessons in order or pick any topic you like. Each lesson takes 15–25 minutes and finishes with a short quiz.',
  'lessons.overallAria': 'Overall progress',
  'lessons.completedOf': '{done} of {total} lessons completed',
  'lessons.loading': 'Loading your progress…',
  'lessons.avgScoreLabel': 'Average quiz score:',
  'lessons.week': 'Week {week}',
  'badge.completed': 'Completed',
  'badge.best': 'Best: {score}%',
  'badge.notStarted': 'Not started',
  'lessons.durationLabel': 'Duration:',
  'lessons.minutesShort': '{n} min',
  'lessons.quizCountLabel': 'Quiz questions:',
  'lessons.quizCount': '{n} quiz questions',
  'lessons.vocabLabel': 'Vocabulary items:',
  'lessons.vocabCount': '{n} words',
  'lessons.review': 'Review lesson',
  'lessons.continue': 'Continue',
  'lessons.open': 'Open lesson',

  // Lesson detail
  'lesson.back': 'All lessons',
  'lesson.beginner': 'Beginner',
  'lesson.objectives': 'What you will learn',
  'lesson.vocabulary': 'Key vocabulary',
  'lesson.tips': 'Practice tips',
  'lesson.navAria': 'Lesson navigation',

  // Quiz page
  'quiz.backTo': 'Back to “{title}”',
  'quiz.label': 'Quiz',
  'quiz.intro':
    '{n} questions · instant feedback · score {pass}% or more to complete the lesson automatically.',

  // Quiz runner
  'quiz.finishedLabel': 'Quiz finished',
  'quiz.resultScore': 'You scored {correct} out of {total} ({percent}%)',
  'quiz.scoreAria': 'Score: {percent}%',
  'quiz.passedMsg':
    'Excellent work! You passed ({pass}% is the pass mark) and this lesson is now marked as completed.',
  'quiz.failedMsg':
    'You need {pass}% to pass. Review the explanations below and try again — you are close!',
  'quiz.recap': 'Question recap',
  'quiz.correctAnswerLabel': 'Correct answer:',
  'quiz.retake': 'Retake quiz',
  'quiz.backToLesson': 'Back to the lesson',
  'quiz.myProgress': 'My progress',
  'quiz.questionOf': 'Question {current} of {total}',
  'quiz.correctSoFar': '{n} correct so far',
  'quiz.progressAria': 'Quiz progress: question {current} of {total}',
  'quiz.correct': 'Correct! 🎉',
  'quiz.notQuite': 'Not quite.',
  'quiz.check': 'Check answer',
  'quiz.next': 'Next question',
  'quiz.seeResult': 'See my result',

  // Lesson progress panel
  'panel.aria': 'Your progress for this lesson',
  'panel.title': 'Your progress',
  'panel.notCompleted': 'Not completed yet',
  'panel.bestScore': 'Best quiz score: {score}% (pass mark {pass}%).',
  'panel.intro':
    'Take the {n}-question quiz and score {pass}% or more to complete this lesson automatically.',
  'panel.retake': 'Retake the quiz',
  'panel.take': 'Take the quiz',
  'panel.markCompleted': 'Mark lesson as completed',
  'panel.reset': 'Reset lesson progress',
  'panel.markedAnnouncement': 'Lesson marked as completed. Great job!',
  'panel.resetAnnouncement': 'Progress for this lesson was reset.',

  // Progress page
  'progress.title': 'My progress',
  'progress.subtitle':
    'Everything below is stored only in this browser — no account needed. Open the same device to see your scores again.',
  'progress.statCompleted': 'Lessons completed',
  'progress.statAvgScore': 'Average quiz score',
  'progress.statQuizzes': 'Quizzes taken',
  'progress.completion': 'Course completion',
  'progress.completionAria': 'Course completion: {percent}%',
  'progress.byLesson': 'Lesson by lesson',
  'progress.bestScore': 'Best quiz score: {score}%',
  'progress.quizNotTaken': 'Quiz not taken yet',
  'progress.inProgress': 'In progress',
  'progress.retake': 'Retake quiz',
  'progress.take': 'Take quiz',
  'progress.clearAria': 'Clear progress for {title}',
  'progress.storageTitle': 'Where is my progress stored?',
  'progress.storageText':
    'Progress is saved with your browser’s local storage on this device. It is never sent anywhere. If you clear your browser data, progress is deleted too — completing lessons again is always possible.',
  'progress.resetAll': 'Reset all progress',
  'progress.confirmDelete': 'Yes, delete everything',
  'progress.confirmWarning':
    'This will erase all completed lessons and quiz scores on this device. Click the button again to confirm.',

  // Install app button
  'install.installed': '✅ NextSpeak is installed — open it from your home screen!',
  'install.button': 'Install NextSpeak',
  'install.ios':
    'On iPhone / iPad: tap the ⬆️ Share button in Safari, then choose Add to Home Screen.',
  'install.generic':
    'Open this site in your browser’s menu and choose Install app (or bookmark it).',

  // 404
  'notFound.title': 'Page not found',
  'notFound.text': 'The page you are looking for doesn’t exist or may have moved.',
  'notFound.goHome': 'Go home',
  'notFound.browse': 'Browse lessons',
} satisfies Record<string, string>;

export type TKey = keyof typeof en;

const es: Record<TKey, string> = {
  // Header & navigation
  'nav.main': 'Navegación principal',
  'nav.home': 'Inicio',
  'nav.lessons': 'Lecciones',
  'nav.progress': 'Progreso',
  'menu.open': 'Abrir menú',
  'menu.close': 'Cerrar menú',
  'lang.label': 'Idioma',
  'theme.toDark': 'Cambiar a modo oscuro',
  'theme.toLight': 'Cambiar a modo claro',

  // Footer
  'footer.tagline':
    'Lecciones gratuitas de inglés para principiantes con quizzes interactivos. Aprende a tu ritmo, en cualquier dispositivo.',
  'footer.learn': 'Aprende',
  'footer.allLessons': 'Todas las lecciones',
  'footer.myProgress': 'Mi progreso',
  'footer.install': 'Instala la app',
  'footer.about': 'Acerca de',
  'footer.author': 'Creado por Oldemar Almengor, profesor de inglés',
  'footer.privacy': 'Tu progreso permanece en este dispositivo — sin cuenta, sin rastreo.',
  'footer.rights': '© {year} NextSpeak. Todos los derechos reservados.',

  // Home
  'home.badge': 'Gratis · Sin registro · {n} lecciones para principiantes',
  'home.heroTitle': 'Aprende inglés con',
  'home.heroAccent': 'confianza',
  'home.heroSubtitle':
    'Lecciones breves y amigables con ejemplos reales y quizzes interactivos. Tu progreso se guarda en tu propio dispositivo — empieza ahora y continúa cuando quieras, donde quieras.',
  'home.ctaStart': 'Empezar a aprender',
  'home.ctaProgress': 'Ver mi progreso',
  'home.statsAria': 'Datos del curso',
  'home.statLessons': 'lecciones para principiantes',
  'home.statQuestions': 'preguntas de quiz con explicaciones',
  'home.statFree': 'gratis, para siempre',
  'home.howTitle': 'Cómo funciona',
  'home.howSubtitle': 'Tres pasos sencillos — repítelos a tu propio ritmo.',
  'home.step1Title': '1. Elige una lección',
  'home.step1Text':
    'Empieza con los saludos o ve al tema que prefieras — cada lección es para principiantes.',
  'home.step2Title': '2. Estudia el contenido',
  'home.step2Text':
    'Explicaciones breves, ejemplos reales, frases clave y una lista de vocabulario en cada lección.',
  'home.step3Title': '3. Haz el quiz',
  'home.step3Text':
    'Responde cinco preguntas y recibe una respuesta instantánea con explicaciones claras.',
  'home.featuredTitle': 'Empieza con estas lecciones',
  'home.featuredSubtitle': 'Desde tu primer “hello” hasta hablar de tus planes de futuro.',
  'home.viewAll': 'Ver todas las lecciones',
  'home.weekMin': 'Semana {week} · {min} min',
  'home.openLesson': 'Abrir lección',
  'home.featuresTitle': 'Hecho para aprender en cualquier lugar',
  'home.feature1Title': 'Funciona en cualquier dispositivo',
  'home.feature1Text':
    'Teléfonos, tabletas y computadoras — el diseño se adapta automáticamente y todo es fácil de tocar.',
  'home.feature2Title': 'Se instala como una app',
  'home.feature2Text':
    'Agrega NextSpeak a tu pantalla de inicio y ábrelo como cualquier app nativa. Sin tienda, sin costos de descarga.',
  'home.feature3Title': 'Sigue funcionando sin internet',
  'home.feature3Text':
    'Las lecciones que abriste quedan disponibles sin internet. Tu progreso se guarda en tu dispositivo.',
  'home.feature4Title': 'Accesible por diseño',
  'home.feature4Text':
    'Soporte completo de teclado, estados de foco claros, texto legible y páginas amigables con lectores de pantalla.',
  'home.installTitle': 'Agrega NextSpeak a tu pantalla de inicio',
  'home.installText':
    'NextSpeak es una aplicación web progresiva (PWA): instálala como una app nativa y ábrela con un toque. En la mayoría de teléfonos y computadoras tu navegador ofrece una opción de instalación.',
  'home.installTip1':
    'Android (Chrome): toca “Instalar NextSpeak” arriba, o elige “Añadir a pantalla de inicio” en el menú.',
  'home.installTip2': 'iPhone / iPad (Safari): Compartir → Añadir a pantalla de inicio.',
  'home.installTip3':
    'Computadora (Chrome / Edge): haz clic en el ícono de instalación de la barra de direcciones.',
  'home.installNote':
    'Bueno saber: las lecciones se guardan en caché después de tu primera visita, así que siguen funcionando sin internet. La primera visita y las actualizaciones posteriores requieren conexión.',
  'home.finalTitle': '¿Listo para decir tu primer “hello”?',
  'home.finalCta': 'Empezar la primera lección',

  // Lessons list
  'lessons.title': 'Lecciones para principiantes',
  'lessons.subtitle':
    'Sigue las lecciones en orden o elige el tema que prefieras. Cada lección dura de 15 a 25 minutos y termina con un quiz corto.',
  'lessons.overallAria': 'Progreso general',
  'lessons.completedOf': '{done} de {total} lecciones completadas',
  'lessons.loading': 'Cargando tu progreso…',
  'lessons.avgScoreLabel': 'Puntuación media del quiz:',
  'lessons.week': 'Semana {week}',
  'badge.completed': 'Completada',
  'badge.best': 'Mejor: {score}%',
  'badge.notStarted': 'Sin empezar',
  'lessons.durationLabel': 'Duración:',
  'lessons.minutesShort': '{n} min',
  'lessons.quizCountLabel': 'Preguntas del quiz:',
  'lessons.quizCount': '{n} preguntas de quiz',
  'lessons.vocabLabel': 'Palabras de vocabulario:',
  'lessons.vocabCount': '{n} palabras',
  'lessons.review': 'Repasar lección',
  'lessons.continue': 'Continuar',
  'lessons.open': 'Abrir lección',

  // Lesson detail
  'lesson.back': 'Todas las lecciones',
  'lesson.beginner': 'Principiante',
  'lesson.objectives': 'Lo que aprenderás',
  'lesson.vocabulary': 'Vocabulario clave',
  'lesson.tips': 'Consejos para practicar',
  'lesson.navAria': 'Navegación entre lecciones',

  // Quiz page
  'quiz.backTo': 'Volver a “{title}”',
  'quiz.label': 'Quiz',
  'quiz.intro':
    '{n} preguntas · respuesta instantánea · obtén {pass}% o más para completar la lección automáticamente.',

  // Quiz runner
  'quiz.finishedLabel': 'Quiz terminado',
  'quiz.resultScore': 'Obtuviste {correct} de {total} correctas ({percent}%)',
  'quiz.scoreAria': 'Puntuación: {percent}%',
  'quiz.passedMsg':
    '¡Excelente! Aprobaste (el mínimo es {pass}%) y esta lección ahora está marcada como completada.',
  'quiz.failedMsg':
    'Necesitas {pass}% para aprobar. Revisa las explicaciones de abajo e inténtalo otra vez, ¡estás muy cerca!',
  'quiz.recap': 'Resumen de preguntas',
  'quiz.correctAnswerLabel': 'Respuesta correcta:',
  'quiz.retake': 'Repetir quiz',
  'quiz.backToLesson': 'Volver a la lección',
  'quiz.myProgress': 'Mi progreso',
  'quiz.questionOf': 'Pregunta {current} de {total}',
  'quiz.correctSoFar': '{n} correctas hasta ahora',
  'quiz.progressAria': 'Progreso del quiz: pregunta {current} de {total}',
  'quiz.correct': '¡Correcto! 🎉',
  'quiz.notQuite': 'Casi.',
  'quiz.check': 'Comprobar respuesta',
  'quiz.next': 'Siguiente pregunta',
  'quiz.seeResult': 'Ver mi resultado',

  // Lesson progress panel
  'panel.aria': 'Tu progreso en esta lección',
  'panel.title': 'Tu progreso',
  'panel.notCompleted': 'Aún no completada',
  'panel.bestScore': 'Mejor puntuación del quiz: {score}% (mínimo para aprobar: {pass}%).',
  'panel.intro':
    'Haz el quiz de {n} preguntas y obtén {pass}% o más para completar esta lección automáticamente.',
  'panel.retake': 'Repetir el quiz',
  'panel.take': 'Hacer el quiz',
  'panel.markCompleted': 'Marcar lección como completada',
  'panel.reset': 'Reiniciar el progreso de la lección',
  'panel.markedAnnouncement': 'Lección marcada como completada. ¡Buen trabajo!',
  'panel.resetAnnouncement': 'El progreso de esta lección se reinició.',

  // Progress page
  'progress.title': 'Mi progreso',
  'progress.subtitle':
    'Todo lo que ves aquí se guarda solo en este navegador — no necesitas cuenta. Abre el mismo dispositivo para ver tus puntuaciones otra vez.',
  'progress.statCompleted': 'Lecciones completadas',
  'progress.statAvgScore': 'Puntuación media del quiz',
  'progress.statQuizzes': 'Quizzes realizados',
  'progress.completion': 'Progreso del curso',
  'progress.completionAria': 'Progreso del curso: {percent}%',
  'progress.byLesson': 'Lección por lección',
  'progress.bestScore': 'Mejor puntuación del quiz: {score}%',
  'progress.quizNotTaken': 'Quiz sin realizar',
  'progress.inProgress': 'En progreso',
  'progress.retake': 'Repetir quiz',
  'progress.take': 'Hacer quiz',
  'progress.clearAria': 'Borrar el progreso de {title}',
  'progress.storageTitle': '¿Dónde se guarda mi progreso?',
  'progress.storageText':
    'El progreso se guarda en el almacenamiento local de tu navegador en este dispositivo. Nunca se envía a ningún sitio. Si borras los datos de tu navegador, el progreso también se elimina — siempre puedes completar las lecciones de nuevo.',
  'progress.resetAll': 'Borrar todo el progreso',
  'progress.confirmDelete': 'Sí, borrar todo',
  'progress.confirmWarning':
    'Esto borrará todas las lecciones completadas y las puntuaciones de quiz en este dispositivo. Haz clic en el botón otra vez para confirmar.',

  // Install app button
  'install.installed': '✅ NextSpeak está instalado — ¡ábrelo desde tu pantalla de inicio!',
  'install.button': 'Instalar NextSpeak',
  'install.ios':
    'En iPhone / iPad: toca el botón ⬆️ Compartir en Safari y elige “Añadir a pantalla de inicio”.',
  'install.generic':
    'Abre este sitio en el menú de tu navegador y elige “Instalar aplicación” (o guárdalo como marcador).',

  // 404
  'notFound.title': 'Página no encontrada',
  'notFound.text': 'La página que buscas no existe o pudo haber cambiado de dirección.',
  'notFound.goHome': 'Ir al inicio',
  'notFound.browse': 'Explorar lecciones',
};

export const DICTIONARY: Record<Lang, Record<TKey, string>> = { en, es };

export type TVars = Record<string, string | number>;

/**
 * Translate a chrome string for the given language, replacing `{placeholder}`
 * markers with the provided variables.
 */
export function translate(lang: Lang, key: TKey, vars?: TVars): string {
  const template = DICTIONARY[lang][key] ?? DICTIONARY.en[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}
