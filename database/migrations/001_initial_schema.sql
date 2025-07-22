-- SchoolNexus Database Schema Migration 001
-- Initial schema creation with all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE SYSTEM TABLES
-- ============================================================================

-- Schools table - Central entity for multi-school support
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  logo_url TEXT,
  website VARCHAR(255),
  principal_name VARCHAR(255),
  established_year INTEGER,
  school_type VARCHAR(50) DEFAULT 'secondary' CHECK (school_type IN ('primary', 'secondary', 'higher_secondary', 'college')),
  is_active BOOLEAN DEFAULT true,
  subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('active', 'expired', 'trial', 'suspended')),
  subscription_plan VARCHAR(20) DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'pro', 'enterprise')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  max_students INTEGER DEFAULT 500,
  max_teachers INTEGER DEFAULT 50,
  timezone VARCHAR(50) DEFAULT 'UTC',
  currency VARCHAR(3) DEFAULT 'USD',
  academic_year_start_month INTEGER DEFAULT 4, -- April
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Administrators table - System and school administrators
CREATE TABLE IF NOT EXISTS administrators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'school_admin', 'assistant_admin')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  avatar_url TEXT,
  department VARCHAR(100),
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic terms table
CREATE TABLE IF NOT EXISTS academic_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  academic_session VARCHAR(20) NOT NULL, -- e.g., "2024-25"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  term_type VARCHAR(20) DEFAULT 'semester' CHECK (term_type IN ('semester', 'trimester', 'quarter', 'annual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, name, academic_session)
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 1,
  category VARCHAR(50), -- e.g., "Mathematics", "Science", "Language"
  grade_levels INTEGER[], -- Array of grade levels this subject is for
  is_mandatory BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, code)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  grade_level INTEGER NOT NULL,
  section VARCHAR(10), -- e.g., "A", "B", "C"
  capacity INTEGER DEFAULT 30,
  current_enrollment INTEGER DEFAULT 0,
  class_teacher_id UUID,
  room_number VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  academic_year VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, name, academic_year)
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_id VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  qualification VARCHAR(255),
  specialization VARCHAR(255),
  experience_years INTEGER DEFAULT 0,
  joining_date DATE NOT NULL,
  salary DECIMAL(10,2),
  employment_type VARCHAR(20) DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'substitute')),
  avatar_url TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  blood_group VARCHAR(5),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, employee_id),
  UNIQUE(school_id, email)
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  student_id VARCHAR(20) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  guardian_name VARCHAR(255),
  guardian_phone VARCHAR(20),
  guardian_email VARCHAR(255),
  guardian_relationship VARCHAR(50) DEFAULT 'parent',
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  blood_group VARCHAR(5),
  medical_conditions TEXT,
  allergies TEXT,
  enrollment_date DATE NOT NULL,
  graduation_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred', 'suspended')),
  avatar_url TEXT,
  roll_number VARCHAR(20),
  admission_number VARCHAR(20),
  previous_school VARCHAR(255),
  transport_required BOOLEAN DEFAULT false,
  hostel_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, student_id),
  UNIQUE(school_id, admission_number)
);

-- Parents table
CREATE TABLE IF NOT EXISTS parents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  occupation VARCHAR(255),
  workplace VARCHAR(255),
  relationship VARCHAR(50) DEFAULT 'parent' CHECK (relationship IN ('father', 'mother', 'guardian', 'parent')),
  emergency_contact BOOLEAN DEFAULT false,
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student-Parent relationships (many-to-many)
CREATE TABLE IF NOT EXISTS student_parents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  relationship VARCHAR(50) NOT NULL,
  is_primary_contact BOOLEAN DEFAULT false,
  can_pickup BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, parent_id)
);

-- Teacher-Subject assignments
CREATE TABLE IF NOT EXISTS teacher_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  academic_term_id UUID REFERENCES academic_terms(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id, class_id, academic_term_id)
);

-- Timetable slots
CREATE TABLE IF NOT EXISTS timetable_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(20),
  academic_term_id UUID REFERENCES academic_terms(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignment_type VARCHAR(20) DEFAULT 'homework' CHECK (assignment_type IN ('homework', 'project', 'quiz', 'exam', 'presentation')),
  total_points INTEGER DEFAULT 100,
  due_date TIMESTAMP WITH TIME ZONE,
  submission_method VARCHAR(20) DEFAULT 'online' CHECK (submission_method IN ('online', 'offline', 'both')),
  allow_late_submission BOOLEAN DEFAULT false,
  late_penalty_percentage INTEGER DEFAULT 0,
  instructions TEXT,
  attachments JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  submission_text TEXT,
  attachments JSONB DEFAULT '[]',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_late BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
  grade DECIMAL(5,2),
  max_grade DECIMAL(5,2),
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES teachers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  academic_term_id UUID REFERENCES academic_terms(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
  grade_type VARCHAR(20) DEFAULT 'assignment' CHECK (grade_type IN ('assignment', 'quiz', 'exam', 'project', 'participation', 'final')),
  points_earned DECIMAL(5,2) NOT NULL,
  total_points DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS (CASE WHEN total_points > 0 THEN (points_earned / total_points) * 100 ELSE 0 END) STORED,
  letter_grade VARCHAR(5),
  comments TEXT,
  date_recorded DATE DEFAULT CURRENT_DATE,
  is_final BOOLEAN DEFAULT false,
  weight DECIMAL(3,2) DEFAULT 1.0, -- For weighted grading
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance records
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period INTEGER, -- For schools with multiple periods
  status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  time_in TIME,
  time_out TIME,
  notes TEXT,
  marked_by UUID REFERENCES teachers(id),
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date, period)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES administrators(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(20) DEFAULT 'announcement' CHECK (notification_type IN ('announcement', 'alert', 'reminder', 'event', 'emergency')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  target_audience VARCHAR(20) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'parents', 'staff')),
  target_classes UUID[], -- Array of class IDs for targeted notifications
  scheduled_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'expired')),
  attachments JSONB DEFAULT '[]',
  read_count INTEGER DEFAULT 0,
  total_recipients INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification recipients (for tracking read status)
CREATE TABLE IF NOT EXISTS notification_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  recipient_type VARCHAR(20) NOT NULL CHECK (recipient_type IN ('student', 'teacher', 'parent', 'admin')),
  recipient_id UUID NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(notification_id, recipient_type, recipient_id)
);

-- Messages table (for direct communication)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('student', 'teacher', 'parent', 'admin')),
  sender_id UUID NOT NULL,
  receiver_type VARCHAR(20) NOT NULL CHECK (receiver_type IN ('student', 'teacher', 'parent', 'admin')),
  receiver_id UUID NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'general' CHECK (message_type IN ('general', 'academic', 'disciplinary', 'administrative')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  parent_message_id UUID REFERENCES messages(id), -- For threaded conversations
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_receiver BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee structures
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fee_type VARCHAR(50) NOT NULL, -- e.g., "tuition", "transport", "library", "exam"
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('one_time', 'monthly', 'quarterly', 'annually')),
  applicable_classes UUID[], -- Array of class IDs
  is_mandatory BOOLEAN DEFAULT true,
  due_day INTEGER DEFAULT 1, -- Day of month when fee is due
  late_fee_amount DECIMAL(10,2) DEFAULT 0,
  late_fee_days INTEGER DEFAULT 30,
  academic_year VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student fee assignments
CREATE TABLE IF NOT EXISTS student_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES fee_structures(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  discount_reason VARCHAR(255),
  final_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount - discount_amount) STORED,
  due_date DATE NOT NULL,
  academic_year VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, fee_structure_id, due_date)
);

-- Fee payments
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_fee_id UUID REFERENCES student_fees(id) ON DELETE CASCADE,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'online', 'check')),
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  transaction_id VARCHAR(255),
  receipt_number VARCHAR(100),
  payment_reference VARCHAR(255),
  notes TEXT,
  collected_by UUID REFERENCES administrators(id),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  isbn VARCHAR(20),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  publisher VARCHAR(255),
  publication_year INTEGER,
  category VARCHAR(100),
  language VARCHAR(50) DEFAULT 'English',
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  location VARCHAR(100), -- Shelf location
  price DECIMAL(8,2),
  condition VARCHAR(20) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
  description TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book borrowing records
CREATE TABLE IF NOT EXISTS book_borrowings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  borrower_type VARCHAR(20) NOT NULL CHECK (borrower_type IN ('student', 'teacher')),
  borrower_id UUID NOT NULL,
  borrowed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  returned_date DATE,
  fine_amount DECIMAL(8,2) DEFAULT 0,
  fine_paid BOOLEAN DEFAULT false,
  condition_on_return VARCHAR(20) CHECK (condition_on_return IN ('excellent', 'good', 'fair', 'poor', 'damaged')),
  notes TEXT,
  issued_by UUID REFERENCES administrators(id),
  returned_to UUID REFERENCES administrators(id),
  status VARCHAR(20) DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue', 'lost')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_type VARCHAR(20),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  uploader_id UUID,
  uploader_type VARCHAR(20),
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('image', 'document', 'video', 'audio', 'other')),
  entity_type VARCHAR(50), -- What this file is attached to
  entity_id UUID,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Schools indexes
CREATE INDEX IF NOT EXISTS idx_schools_subscription_status ON schools(subscription_status);
CREATE INDEX IF NOT EXISTS idx_schools_is_active ON schools(is_active);

-- Administrators indexes
CREATE INDEX IF NOT EXISTS idx_administrators_school_id ON administrators(school_id);
CREATE INDEX IF NOT EXISTS idx_administrators_user_id ON administrators(user_id);
CREATE INDEX IF NOT EXISTS idx_administrators_role ON administrators(role);

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(school_id, student_id);

-- Teachers indexes
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON teachers(school_id, employee_id);

-- Classes indexes
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade_level ON classes(grade_level);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(class_teacher_id);

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance_records(class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);

-- Grades indexes
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_term_id ON grades(academic_term_id);

-- Assignments indexes
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class_id ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_school_id ON notifications(school_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_date ON notifications(scheduled_date);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_type, sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_type, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at column
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_administrators_updated_at BEFORE UPDATE ON administrators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academic_terms_updated_at BEFORE UPDATE ON academic_terms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timetable_slots_updated_at BEFORE UPDATE ON timetable_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON assignment_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fee_structures_updated_at BEFORE UPDATE ON fee_structures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_fees_updated_at BEFORE UPDATE ON student_fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fee_payments_updated_at BEFORE UPDATE ON fee_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_book_borrowings_updated_at BEFORE UPDATE ON book_borrowings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_borrowings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded based on specific requirements)
-- Super admins can access everything
CREATE POLICY "Super admins can access all schools" ON schools FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM administrators WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- School admins can access their school data
CREATE POLICY "School admins can access their school" ON schools FOR ALL TO authenticated USING (
  id IN (SELECT school_id FROM administrators WHERE user_id = auth.uid() AND role IN ('school_admin', 'assistant_admin'))
);
