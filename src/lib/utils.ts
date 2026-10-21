import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NSK-${result}`;
}

export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NSK-${result}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getWeekRange(week: number): { start: number; end: number } {
  return {
    start: (week - 1) * 2 + 1,
    end: week * 2,
  };
}

export function getCurrentWeekClass(): { week: number; class: number } {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.ceil((days + startOfYear.getDay()) / 7);
  const classNum = now.getDay() <= 3 ? 1 : 2; // Simplified logic
  return { week: Math.min(week, 4), class: classNum };
}

export const EXERCISE_TYPES = {
  multiple_choice: { label: 'Opción múltiple', icon: 'list' },
  fill_blank: { label: 'Completar', icon: 'edit' },
  matching: { label: 'Emparejar', icon: 'link' },
  speaking: { label: 'Hablar', icon: 'mic' },
  writing: { label: 'Escribir', icon: 'pen' },
  listening: { label: 'Escuchar', icon: 'headphones' },
} as const;

export const ASSIGNMENT_TYPES = {
  writing: { label: 'Redacción', color: 'blue' },
  speaking: { label: 'Expresión oral', color: 'green' },
  quiz: { label: 'Cuestionario', color: 'purple' },
  project: { label: 'Proyecto', color: 'orange' },
} as const;

export const RESOURCE_TYPES = {
  pdf: { label: 'PDF', icon: 'file-text', color: 'red' },
  video: { label: 'Video', icon: 'video', color: 'blue' },
  audio: { label: 'Audio', icon: 'music', color: 'green' },
  image: { label: 'Imagen', icon: 'image', color: 'purple' },
  link: { label: 'Enlace', icon: 'external-link', color: 'gray' },
} as const;