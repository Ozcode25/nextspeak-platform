export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'teacher' | 'student';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          last_login: string | null;
          password_hash: string;
          bio: string | null;
          specialties: string[] | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'teacher' | 'student';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          last_login?: string | null;
          password_hash: string;
          bio?: string | null;
          specialties?: string[] | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'teacher' | 'student';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          last_login?: string | null;
          password_hash?: string;
          bio?: string | null;
          specialties?: string[] | null;
        };
      };
      courses: {
        Row: {
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
          thumbnail_url: string | null;
        };
        Insert: {
          id?: string;
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
          created_at?: string;
          updated_at?: string;
          is_published?: boolean;
          thumbnail_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          teacher_id?: string;
          duration_weeks?: number;
          classes_per_week?: number;
          total_classes?: number;
          objectives?: string[];
          methodology?: string;
          evaluation_criteria?: string[];
          expected_outcomes?: string[];
          recommendations?: string[];
          created_at?: string;
          updated_at?: string;
          is_published?: boolean;
          thumbnail_url?: string | null;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          week_number: number;
          class_number: number;
          title: string;
          topics: string[];
          activities: string[];
          homework: string;
          content: Json;
          resources: Json;
          order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          week_number: number;
          class_number: number;
          title: string;
          topics: string[];
          activities: string[];
          homework: string;
          content: Json;
          resources: Json;
          order: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          week_number?: number;
          class_number?: number;
          title?: string;
          topics?: string[];
          activities?: string[];
          homework?: string;
          content?: Json;
          resources?: Json;
          order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tokens: {
        Row: {
          id: string;
          token: string;
          teacher_id: string;
          student_id: string | null;
          student_email: string | null;
          student_name: string | null;
          course_id: string;
          expires_at: string;
          max_uses: number;
          used_count: number;
          is_revoked: boolean;
          revoked_at: string | null;
          revoked_reason: string | null;
          created_at: string;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          token: string;
          teacher_id: string;
          student_id?: string | null;
          student_email?: string | null;
          student_name?: string | null;
          course_id: string;
          expires_at: string;
          max_uses: number;
          used_count?: number;
          is_revoked?: boolean;
          revoked_at?: string | null;
          revoked_reason?: string | null;
          created_at?: string;
          last_used_at?: string | null;
        };
        Update: {
          id?: string;
          token?: string;
          teacher_id?: string;
          student_id?: string | null;
          student_email?: string | null;
          student_name?: string | null;
          course_id?: string;
          expires_at?: string;
          max_uses?: number;
          used_count?: number;
          is_revoked?: boolean;
          revoked_at?: string | null;
          revoked_reason?: string | null;
          created_at?: string;
          last_used_at?: string | null;
        };
      };
      assignments: {
        Row: {
          id: string;
          lesson_id: string;
          student_id: string;
          title: string;
          description: string;
          type: 'writing' | 'speaking' | 'quiz' | 'project';
          status: 'pending' | 'submitted' | 'graded' | 'returned';
          submission: Json | null;
          grade: number | null;
          feedback: string | null;
          due_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          student_id: string;
          title: string;
          description: string;
          type: 'writing' | 'speaking' | 'quiz' | 'project';
          status?: 'pending' | 'submitted' | 'graded' | 'returned';
          submission?: Json | null;
          grade?: number | null;
          feedback?: string | null;
          due_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          student_id?: string;
          title?: string;
          description?: string;
          type?: 'writing' | 'speaking' | 'quiz' | 'project';
          status?: 'pending' | 'submitted' | 'graded' | 'returned';
          submission?: Json | null;
          grade?: number | null;
          feedback?: string | null;
          due_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          content: string;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          content: string;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          lesson_id?: string;
          content?: string;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress_entries: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          completed: boolean;
          score: number | null;
          time_spent: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          completed?: boolean;
          score?: number | null;
          time_spent?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          lesson_id?: string;
          completed?: boolean;
          score?: number | null;
          time_spent?: number;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          name: string;
          description: string;
          issued_at: string;
          verification_code: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          name: string;
          description: string;
          issued_at?: string;
          verification_code: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          name?: string;
          description?: string;
          issued_at?: string;
          verification_code?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];