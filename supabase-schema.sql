-- NextSpeak Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'student')),
    avatar_url TEXT,
    password_hash TEXT NOT NULL,
    bio TEXT,
    specialties TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duration_weeks INTEGER NOT NULL DEFAULT 4,
    classes_per_week INTEGER NOT NULL DEFAULT 2,
    total_classes INTEGER GENERATED ALWAYS AS (duration_weeks * classes_per_week) STORED,
    objectives TEXT[],
    methodology TEXT,
    evaluation_criteria TEXT[],
    expected_outcomes TEXT[],
    recommendations TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE,
    thumbnail_url TEXT
);

-- Lessons table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    class_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    topics TEXT[],
    activities TEXT[],
    homework TEXT,
    content JSONB NOT NULL DEFAULT '{}',
    resources JSONB NOT NULL DEFAULT '[]',
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, week_number, class_number)
);

-- Tokens table (for student access control)
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(100) UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE SET NULL,
    student_email VARCHAR(255),
    student_name VARCHAR(255),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    max_uses INTEGER NOT NULL DEFAULT 1,
    used_count INTEGER NOT NULL DEFAULT 0,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    revoked_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

-- Assignments table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('writing', 'speaking', 'quiz', 'project')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'returned')),
    submission JSONB,
    grade INTEGER,
    feedback TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table (student private notes per lesson)
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- Progress entries table
CREATE TABLE progress_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER,
    time_spent INTEGER DEFAULT 0, -- minutes
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- Certificates table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    verification_code VARCHAR(50) UNIQUE NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_teacher_id ON users(teacher_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX idx_tokens_token ON tokens(token);
CREATE INDEX idx_tokens_teacher_id ON tokens(teacher_id);
CREATE INDEX idx_tokens_student_id ON tokens(student_id);
CREATE INDEX idx_tokens_course_id ON tokens(course_id);
CREATE INDEX idx_tokens_active ON tokens(is_revoked, expires_at);
CREATE INDEX idx_assignments_lesson_id ON assignments(lesson_id);
CREATE INDEX idx_assignments_student_id ON assignments(student_id);
CREATE INDEX idx_notes_student_lesson ON notes(student_id, lesson_id);
CREATE INDEX idx_progress_student_id ON progress_entries(student_id);
CREATE INDEX idx_progress_lesson_id ON progress_entries(lesson_id);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Teachers can view their students" ON users FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'teacher' AND users.teacher_id = auth.uid())
);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Teachers can manage own courses" ON courses FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Students can view enrolled courses" ON courses FOR SELECT USING (
    EXISTS (SELECT 1 FROM tokens WHERE student_id = auth.uid() AND course_id = courses.id AND is_revoked = FALSE AND expires_at > NOW())
);

-- Lessons policies
CREATE POLICY "Teachers can manage lessons in own courses" ON lessons FOR ALL USING (
    EXISTS (SELECT 1 FROM courses WHERE id = lessons.course_id AND teacher_id = auth.uid())
);
CREATE POLICY "Students can view published lessons in enrolled courses" ON lessons FOR SELECT USING (
    is_published = TRUE AND
    EXISTS (SELECT 1 FROM tokens WHERE student_id = auth.uid() AND course_id = lessons.course_id AND is_revoked = FALSE AND expires_at > NOW())
);

-- Tokens policies
CREATE POLICY "Teachers can manage own tokens" ON tokens FOR ALL USING (teacher_id = auth.uid());
CREATE POLICY "Students can view own tokens" ON tokens FOR SELECT USING (student_id = auth.uid());

-- Assignments policies
CREATE POLICY "Teachers can manage assignments in own courses" ON assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM lessons JOIN courses ON lessons.course_id = courses.id WHERE lessons.id = assignments.lesson_id AND courses.teacher_id = auth.uid())
);
CREATE POLICY "Students can view and submit own assignments" ON assignments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can submit own assignments" ON assignments FOR UPDATE USING (student_id = auth.uid());

-- Notes policies
CREATE POLICY "Students can manage own notes" ON notes FOR ALL USING (student_id = auth.uid());

-- Progress policies
CREATE POLICY "Students can manage own progress" ON progress_entries FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Teachers can view student progress" ON progress_entries FOR SELECT USING (
    EXISTS (SELECT 1 FROM lessons JOIN courses ON lessons.course_id = courses.id WHERE lessons.id = progress_entries.lesson_id AND courses.teacher_id = auth.uid())
);

-- Certificates policies
CREATE POLICY "Students can view own certificates" ON certificates FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Teachers can issue certificates to their students" ON certificates FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM courses WHERE id = certificates.course_id AND teacher_id = auth.uid()) AND
    EXISTS (SELECT 1 FROM users WHERE id = certificates.student_id AND teacher_id = auth.uid())
);
CREATE POLICY "Anyone can verify certificates" ON certificates FOR SELECT USING (TRUE);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'NSK-';
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to generate token
CREATE OR REPLACE FUNCTION generate_access_token()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := 'NSK-';
BEGIN
    FOR i IN 1..32 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing (optional)
-- INSERT INTO users (email, name, role, password_hash) VALUES 
-- ('teacher@nextspeak.com', 'Oldemar Almengor', 'teacher', '$2a$12$hash...'),
-- ('student@nextspeak.com', 'Valeria', 'student', '$2a$12$hash...');