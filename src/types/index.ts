export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  last_login?: string;
}

export interface TeacherProfile extends User {
  role: 'teacher';
  bio?: string;
  specialties?: string[];
}

export interface StudentProfile extends User {
  role: 'student';
  teacher_id: string;
  token_id?: string;
  progress: StudentProgress;
  current_week: number;
  current_class: number;
}

export interface StudentProgress {
  completed_classes: number[];
  completed_assignments: string[];
  total_study_time: number; // in minutes
  average_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  name: string;
  description: string;
  issued_at: string;
  course_id: string;
  verification_code: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  teacher_id: string;
  duration_weeks: number;
  classes_per_week: number;
  total_classes: number;
  objectives: string[];
  methodology: string;
  evaluation_criteria: string[];
  expected_outcomes: string[];
  recommendations: string[];
  created_at: string;
  updated_at: string;
  is_published: boolean;
  thumbnail_url?: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  week_number: number;
  class_number: number;
  title: string;
  topics: string[];
  activities: string[];
  homework: string;
  content: LessonContent;
  resources: LessonResource[];
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonContent {
  introduction: string;
  grammar_explanation?: string;
  vocabulary: VocabularyItem[];
  examples: Example[];
  dialogues: Dialogue[];
  exercises: Exercise[];
  tips: string[];
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
  example_sentence: string;
  audio_url?: string;
}

export interface Example {
  english: string;
  spanish: string;
  context: string;
}

export interface Dialogue {
  id: string;
  title: string;
  participants: string[];
  lines: DialogueLine[];
  audio_url?: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  translation?: string;
}

export interface Exercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching' | 'speaking' | 'writing' | 'listening';
  question: string;
  options?: string[];
  correct_answer: string | string[];
  explanation?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonResource {
  id: string;
  type: 'pdf' | 'video' | 'audio' | 'image' | 'link';
  title: string;
  url: string;
  description?: string;
  size?: number;
}

export interface Token {
  id: string;
  token: string;
  teacher_id: string;
  student_id?: string;
  student_email?: string;
  student_name?: string;
  course_id: string;
  expires_at: string;
  max_uses: number;
  used_count: number;
  is_revoked: boolean;
  revoked_at?: string;
  revoked_reason?: string;
  created_at: string;
  last_used_at?: string;
}

export interface Assignment {
  id: string;
  lesson_id: string;
  student_id: string;
  title: string;
  description: string;
  type: 'writing' | 'speaking' | 'quiz' | 'project';
  status: 'pending' | 'submitted' | 'graded' | 'returned';
  submission?: AssignmentSubmission;
  grade?: number;
  feedback?: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  content: string;
  attachments: string[];
  submitted_at: string;
  audio_url?: string;
  video_url?: string;
}

export interface Note {
  id: string;
  student_id: string;
  lesson_id: string;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgressEntry {
  id: string;
  student_id: string;
  lesson_id: string;
  completed: boolean;
  score?: number;
  time_spent: number; // minutes
  completed_at?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface JWTPayload {
  user_id: string;
  email: string;
  role: UserRole;
  token_id?: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  user_id: string;
  email: string;
  role: UserRole;
  token_version: number;
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  teacher_code?: string; // For students joining a teacher
}

export interface TokenGenerationData {
  student_email: string;
  student_name: string;
  course_id: string;
  expires_in_days: number;
  max_uses?: number;
}

export interface TeacherDashboardStats {
  total_students: number;
  active_students: number;
  total_courses: number;
  total_lessons: number;
  average_completion_rate: number;
  tokens_issued: number;
  tokens_active: number;
  tokens_revoked: number;
}

export interface StudentDashboardStats {
  current_streak: number;
  total_study_time: number;
  completed_lessons: number;
  total_lessons: number;
  average_score: number;
  current_week: number;
  current_class: number;
  next_class: Lesson | null;
  certificates_earned: number;
}