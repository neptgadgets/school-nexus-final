-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  address TEXT,
  phone VARCHAR,
  email VARCHAR UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  subscription_status VARCHAR DEFAULT 'trial' CHECK (subscription_status IN ('active', 'expired', 'trial')),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create administrators table
CREATE TABLE IF NOT EXISTS administrators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL CHECK (role IN ('super_admin', 'school_admin')),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create academic_terms table
CREATE TABLE IF NOT EXISTS academic_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  academic_session VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  code VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, code)
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  capacity INTEGER DEFAULT 30,
  current_enrollment INTEGER DEFAULT 0,
  class_teacher_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, name)
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  address TEXT,
  date_of_birth DATE,
  gender VARCHAR CHECK (gender IN ('male', 'female', 'other')),
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  joining_date DATE NOT NULL,
  salary DECIMAL(10,2),
  avatar_url TEXT,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, employee_id)
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  parent_phone VARCHAR NOT NULL,
  parent_email VARCHAR,
  address TEXT,
  date_of_birth DATE NOT NULL,
  gender VARCHAR NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  class_id UUID REFERENCES classes(id),
  admission_date DATE NOT NULL,
  guardian_name VARCHAR NOT NULL,
  guardian_relationship VARCHAR NOT NULL,
  medical_info TEXT,
  avatar_url TEXT,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'transferred', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, student_id)
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  term_id UUID REFERENCES academic_terms(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 100,
  duration_minutes INTEGER NOT NULL,
  instructions TEXT,
  status VARCHAR DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_results table
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained DECIMAL(5,2) NOT NULL,
  grade VARCHAR,
  remarks TEXT,
  is_absent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

-- Create fee_types table
CREATE TABLE IF NOT EXISTS fee_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  due_frequency VARCHAR CHECK (due_frequency IN ('monthly', 'quarterly', 'annually')),
  is_mandatory BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fee_records table
CREATE TABLE IF NOT EXISTS fee_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  fee_type_id UUID REFERENCES fee_types(id) ON DELETE CASCADE,
  term_id UUID REFERENCES academic_terms(id),
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  balance_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  due_date DATE NOT NULL,
  payment_status VARCHAR DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fee_payments table
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fee_record_id UUID REFERENCES fee_records(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'card')),
  payment_reference VARCHAR,
  payment_date DATE NOT NULL,
  received_by UUID REFERENCES administrators(id),
  remarks TEXT,
  receipt_number VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teacher_subjects table (junction table)
CREATE TABLE IF NOT EXISTS teacher_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, subject_id, class_id)
);

-- Add foreign key constraint for class_teacher_id
ALTER TABLE classes ADD CONSTRAINT fk_class_teacher 
  FOREIGN KEY (class_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_administrators_user_id ON administrators(user_id);
CREATE INDEX IF NOT EXISTS idx_administrators_school_id ON administrators(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_exams_school_id ON exams(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_records_student_id ON fee_records(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_fee_record_id ON fee_payments(fee_record_id);

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subjects ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Schools policies (Super admins can see all, school admins can see their own)
CREATE POLICY "Super admins can view all schools" ON schools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM administrators 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

CREATE POLICY "School admins can view their school" ON schools
  FOR SELECT USING (
    id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

-- Administrators policies
CREATE POLICY "Administrators can view their own record" ON administrators
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all administrators" ON administrators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM administrators 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- Students policies
CREATE POLICY "School admins can manage their school students" ON students
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

-- Teachers policies
CREATE POLICY "School admins can manage their school teachers" ON teachers
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

-- Apply similar policies to other tables...
CREATE POLICY "School admins can manage their school data" ON academic_terms
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

CREATE POLICY "School admins can manage their school data" ON subjects
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

CREATE POLICY "School admins can manage their school data" ON classes
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

CREATE POLICY "School admins can manage their school data" ON exams
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

CREATE POLICY "School admins can manage their school data" ON fee_types
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

CREATE POLICY "School admins can manage their school data" ON fee_records
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM administrators 
      WHERE user_id = auth.uid() AND role = 'school_admin' AND is_active = true
    )
  );

-- Functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_administrators_updated_at BEFORE UPDATE ON administrators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO schools (name, address, phone, email) VALUES
('Greenwood High School', '123 Education St, Kampala', '+256700000001', 'admin@greenwood.sch.ug'),
('Creamland NPS', '456 Learning Ave, Entebbe', '+256700000002', 'info@creamland.sch.ug'),
('Riverside Academy', '789 Knowledge Rd, Jinja', '+256700000003', 'contact@riverside.sch.ug');

-- Insert sample subjects
INSERT INTO subjects (school_id, code, name, description, credits) VALUES
((SELECT id FROM schools WHERE name = 'Creamland NPS'), 'ENG', 'ENGLISH', 'English Language', 1);

-- Insert sample classes
INSERT INTO classes (school_id, name, capacity) VALUES
((SELECT id FROM schools WHERE name = 'Creamland NPS'), 'P.7 A', 30),
((SELECT id FROM schools WHERE name = 'Creamland NPS'), 'P.6 A', 30);

-- Insert sample academic term
INSERT INTO academic_terms (school_id, name, academic_session, start_date, end_date, is_current) VALUES
((SELECT id FROM schools WHERE name = 'Creamland NPS'), 'Term 2', '2025-2026', '2025-05-26', '2025-09-30', true);

-- Insert sample fee types
INSERT INTO fee_types (school_id, name, amount, is_mandatory) VALUES
((SELECT id FROM schools WHERE name = 'Creamland NPS'), 'Tuition', 500000, true);
