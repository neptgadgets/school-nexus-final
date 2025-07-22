-- SchoolNexus Demo Data Seeds
-- This file contains sample data for demonstration purposes

-- ============================================================================
-- DEMO SCHOOLS
-- ============================================================================

INSERT INTO schools (id, name, address, phone, email, website, principal_name, established_year, school_type, subscription_status, subscription_plan, max_students, max_teachers) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'Central High School', '123 Education St, Academic City, AC 12345', '+1-555-0101', 'admin@centralhigh.edu', 'https://centralhigh.edu', 'Dr. Sarah Johnson', 1985, 'secondary', 'active', 'pro', 1200, 80),
('123e4567-e89b-12d3-a456-426614174001', 'Westside Academy', '456 Learning Ave, Knowledge Town, KT 67890', '+1-555-0102', 'info@westsideacademy.edu', 'https://westsideacademy.edu', 'Mr. Michael Brown', 1992, 'secondary', 'active', 'enterprise', 800, 60),
('123e4567-e89b-12d3-a456-426614174002', 'Riverside Elementary', '789 Scholar Rd, Education Valley, EV 11111', '+1-555-0103', 'contact@riverside.edu', 'https://riverside.edu', 'Ms. Emily Davis', 1978, 'primary', 'trial', 'basic', 400, 25);

-- ============================================================================
-- DEMO ADMINISTRATORS
-- ============================================================================

-- Note: In a real implementation, these would be linked to actual auth.users
INSERT INTO administrators (id, school_id, role, first_name, last_name, email, phone, department, is_active) VALUES
('223e4567-e89b-12d3-a456-426614174000', NULL, 'super_admin', 'Super', 'Admin', 'superadmin@schoolnexus.com', '+1-555-9999', 'System Administration', true),
('223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'school_admin', 'John', 'Smith', 'admin@schoolnexus.com', '+1-555-0201', 'Administration', true),
('223e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174001', 'school_admin', 'Jane', 'Wilson', 'jane.wilson@westsideacademy.edu', '+1-555-0202', 'Administration', true);

-- ============================================================================
-- DEMO ACADEMIC TERMS
-- ============================================================================

INSERT INTO academic_terms (id, school_id, name, academic_session, start_date, end_date, is_current, term_type) VALUES
('323e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'First Semester', '2024-25', '2024-08-15', '2024-12-20', true, 'semester'),
('323e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'Second Semester', '2024-25', '2025-01-08', '2025-05-30', false, 'semester'),
('323e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174001', 'Fall Term', '2024-25', '2024-09-01', '2024-12-15', true, 'semester');

-- ============================================================================
-- DEMO SUBJECTS
-- ============================================================================

INSERT INTO subjects (id, school_id, code, name, description, credits, category, grade_levels, is_mandatory) VALUES
-- Central High School subjects
('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'MATH101', 'Mathematics', 'Advanced Mathematics including Algebra and Geometry', 4, 'Mathematics', ARRAY[9,10,11,12], true),
('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'ENG101', 'English Language Arts', 'Comprehensive English language and literature', 4, 'Language Arts', ARRAY[9,10,11,12], true),
('423e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', 'SCI101', 'Biology', 'Introduction to biological sciences', 4, 'Science', ARRAY[9,10,11,12], true),
('423e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', 'HIST101', 'World History', 'Comprehensive world history and social studies', 3, 'Social Studies', ARRAY[9,10,11,12], true),
('423e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', 'CHEM101', 'Chemistry', 'Introduction to chemical sciences', 4, 'Science', ARRAY[10,11,12], false),
('423e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', 'PHYS101', 'Physics', 'Introduction to physical sciences', 4, 'Science', ARRAY[11,12], false),
-- Westside Academy subjects
('423e4567-e89b-12d3-a456-426614174010', '123e4567-e89b-12d3-a456-426614174001', 'MATH201', 'Advanced Mathematics', 'Calculus and advanced mathematical concepts', 4, 'Mathematics', ARRAY[11,12], true),
('423e4567-e89b-12d3-a456-426614174011', '123e4567-e89b-12d3-a456-426614174001', 'ENG201', 'Literature', 'Advanced literature and composition', 4, 'Language Arts', ARRAY[11,12], true);

-- ============================================================================
-- DEMO CLASSES
-- ============================================================================

INSERT INTO classes (id, school_id, name, description, grade_level, section, capacity, current_enrollment, room_number, academic_year) VALUES
-- Central High School classes
('523e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'Grade 9A', 'Freshman class section A', 9, 'A', 30, 28, '101', '2024-25'),
('523e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'Grade 9B', 'Freshman class section B', 9, 'B', 30, 25, '102', '2024-25'),
('523e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', 'Grade 10A', 'Sophomore class section A', 10, 'A', 30, 28, '201', '2024-25'),
('523e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', 'Grade 10B', 'Sophomore class section B', 10, 'B', 30, 26, '202', '2024-25'),
('523e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', 'Grade 11A', 'Junior class section A', 11, 'A', 25, 22, '301', '2024-25'),
('523e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', 'Grade 12A', 'Senior class section A', 12, 'A', 25, 20, '401', '2024-25');

-- ============================================================================
-- DEMO TEACHERS
-- ============================================================================

INSERT INTO teachers (id, school_id, employee_id, first_name, last_name, email, phone, qualification, specialization, experience_years, joining_date, employment_type) VALUES
-- Central High School teachers
('623e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'T001', 'Robert', 'Johnson', 'teacher@schoolnexus.com', '+1-555-1001', 'M.Ed Mathematics', 'Mathematics', 8, '2018-08-15', 'full_time'),
('623e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'T002', 'Maria', 'Garcia', 'maria.garcia@centralhigh.edu', '+1-555-1002', 'M.A English Literature', 'English Language Arts', 12, '2015-08-20', 'full_time'),
('623e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', 'T003', 'David', 'Chen', 'david.chen@centralhigh.edu', '+1-555-1003', 'Ph.D Biology', 'Biology', 15, '2012-08-15', 'full_time'),
('623e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', 'T004', 'Sarah', 'Williams', 'sarah.williams@centralhigh.edu', '+1-555-1004', 'M.A History', 'World History', 10, '2016-08-18', 'full_time'),
('623e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', 'T005', 'Michael', 'Brown', 'michael.brown@centralhigh.edu', '+1-555-1005', 'M.S Chemistry', 'Chemistry', 6, '2020-08-20', 'full_time'),
('623e4567-e89b-12d3-a456-426614174005', '123e4567-e89b-12d3-a456-426614174000', 'T006', 'Lisa', 'Davis', 'lisa.davis@centralhigh.edu', '+1-555-1006', 'Ph.D Physics', 'Physics', 14, '2013-08-15', 'full_time');

-- Update class teachers
UPDATE classes SET class_teacher_id = '623e4567-e89b-12d3-a456-426614174000' WHERE id = '523e4567-e89b-12d3-a456-426614174002'; -- Grade 10A - Math teacher

-- ============================================================================
-- DEMO STUDENTS
-- ============================================================================

INSERT INTO students (id, school_id, class_id, student_id, first_name, last_name, date_of_birth, gender, email, guardian_name, guardian_phone, guardian_email, enrollment_date, roll_number, admission_number) VALUES
-- Grade 10A students
('723e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', 'S001', 'Emma', 'Johnson', '2008-05-15', 'female', 'student@schoolnexus.com', 'John Johnson', '+1-555-2001', 'parent@schoolnexus.com', '2023-08-15', '001', 'ADM001'),
('723e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', 'S002', 'James', 'Smith', '2008-03-22', 'male', 'james.smith@student.centralhigh.edu', 'Mary Smith', '+1-555-2002', 'mary.smith@email.com', '2023-08-15', '002', 'ADM002'),
('723e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', 'S003', 'Sophia', 'Davis', '2008-07-10', 'female', 'sophia.davis@student.centralhigh.edu', 'Robert Davis', '+1-555-2003', 'robert.davis@email.com', '2023-08-15', '003', 'ADM003'),
('723e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', 'S004', 'William', 'Wilson', '2008-01-18', 'male', 'william.wilson@student.centralhigh.edu', 'Jennifer Wilson', '+1-555-2004', 'jennifer.wilson@email.com', '2023-08-15', '004', 'ADM004'),
('723e4567-e89b-12d3-a456-426614174004', '123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', 'S005', 'Olivia', 'Brown', '2008-09-05', 'female', 'olivia.brown@student.centralhigh.edu', 'Michael Brown', '+1-555-2005', 'michael.brown@email.com', '2023-08-15', '005', 'ADM005');

-- Update class enrollment counts
UPDATE classes SET current_enrollment = 5 WHERE id = '523e4567-e89b-12d3-a456-426614174002';

-- ============================================================================
-- DEMO PARENTS
-- ============================================================================

INSERT INTO parents (id, first_name, last_name, email, phone, address, occupation, relationship) VALUES
('823e4567-e89b-12d3-a456-426614174000', 'John', 'Johnson', 'parent@schoolnexus.com', '+1-555-2001', '123 Family St, Parent City, PC 12345', 'Engineer', 'father'),
('823e4567-e89b-12d3-a456-426614174001', 'Mary', 'Smith', 'mary.smith@email.com', '+1-555-2002', '456 Home Ave, Parent Town, PT 67890', 'Teacher', 'mother'),
('823e4567-e89b-12d3-a456-426614174002', 'Robert', 'Davis', 'robert.davis@email.com', '+1-555-2003', '789 Guardian Rd, Family Valley, FV 11111', 'Doctor', 'father');

-- Link students to parents
INSERT INTO student_parents (student_id, parent_id, relationship, is_primary_contact) VALUES
('723e4567-e89b-12d3-a456-426614174000', '823e4567-e89b-12d3-a456-426614174000', 'father', true),
('723e4567-e89b-12d3-a456-426614174001', '823e4567-e89b-12d3-a456-426614174001', 'mother', true),
('723e4567-e89b-12d3-a456-426614174002', '823e4567-e89b-12d3-a456-426614174002', 'father', true);

-- ============================================================================
-- DEMO TEACHER-SUBJECT ASSIGNMENTS
-- ============================================================================

INSERT INTO teacher_subjects (teacher_id, subject_id, class_id, academic_term_id, is_primary) VALUES
-- Math teacher assignments
('623e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '323e4567-e89b-12d3-a456-426614174000', true),
('623e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174003', '323e4567-e89b-12d3-a456-426614174000', true),
-- English teacher assignments
('623e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174001', '523e4567-e89b-12d3-a456-426614174002', '323e4567-e89b-12d3-a456-426614174000', true),
-- Biology teacher assignments
('623e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174002', '323e4567-e89b-12d3-a456-426614174000', true);

-- ============================================================================
-- DEMO ASSIGNMENTS
-- ============================================================================

INSERT INTO assignments (id, school_id, teacher_id, subject_id, class_id, title, description, assignment_type, total_points, due_date, status) VALUES
('923e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', 'Algebraic Equations Practice', 'Solve quadratic equations from Chapter 5, problems 1-20. Show all work and steps.', 'homework', 100, '2024-02-15 23:59:00+00', 'published'),
('923e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', 'Geometry Project', 'Create a presentation showing real-world applications of geometric principles in architecture.', 'project', 150, '2024-02-28 23:59:00+00', 'published'),
('923e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174002', 'Cell Structure Lab Report', 'Complete lab report on cell structure observations from microscopy lab.', 'project', 100, '2024-02-20 23:59:00+00', 'published');

-- ============================================================================
-- DEMO GRADES
-- ============================================================================

INSERT INTO grades (student_id, subject_id, teacher_id, academic_term_id, assignment_id, grade_type, points_earned, total_points, letter_grade, comments, date_recorded) VALUES
-- Emma Johnson's grades
('723e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174000', '923e4567-e89b-12d3-a456-426614174000', 'homework', 85, 100, 'B', 'Good work! Pay attention to showing all steps.', '2024-01-20'),
('723e4567-e89b-12d3-a456-426614174000', '423e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174002', '323e4567-e89b-12d3-a456-426614174000', '923e4567-e89b-12d3-a456-426614174002', 'project', 92, 100, 'A-', 'Excellent lab report with detailed observations.', '2024-01-18'),
-- James Smith's grades
('723e4567-e89b-12d3-a456-426614174001', '423e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174000', '923e4567-e89b-12d3-a456-426614174000', 'homework', 78, 100, 'C+', 'Need to show more work in problem-solving steps.', '2024-01-20'),
-- Sophia Davis's grades
('723e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', '323e4567-e89b-12d3-a456-426614174000', '923e4567-e89b-12d3-a456-426614174000', 'homework', 95, 100, 'A', 'Excellent work! Perfect understanding demonstrated.', '2024-01-20');

-- ============================================================================
-- DEMO ATTENDANCE RECORDS
-- ============================================================================

INSERT INTO attendance_records (student_id, class_id, teacher_id, date, status, marked_by) VALUES
-- Recent attendance for Grade 10A students
('723e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-22', 'present', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174001', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-22', 'present', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-22', 'late', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174003', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-22', 'present', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174004', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-22', 'absent', '623e4567-e89b-12d3-a456-426614174000'),
-- Previous day
('723e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-21', 'present', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174001', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-21', 'present', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-21', 'present', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174003', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-21', 'present', '623e4567-e89b-12d3-a456-426614174000'),
('723e4567-e89b-12d3-a456-426614174004', '523e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174000', '2024-01-21', 'present', '623e4567-e89b-12d3-a456-426614174000');

-- ============================================================================
-- DEMO NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (id, school_id, sender_id, title, message, notification_type, priority, target_audience, status, total_recipients, read_count, created_at) VALUES
('a23e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001', 'Parent-Teacher Conference Reminder', 'Dear parents, this is a reminder that parent-teacher conferences are scheduled for next week. Please check your assigned time slots in the parent portal.', 'reminder', 'high', 'parents', 'sent', 150, 120, '2024-01-20 14:30:00+00'),
('a23e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001', 'New Academic Term Starting', 'The new academic term will begin on February 1st, 2024. All students are expected to be present on the first day. Please ensure all fees are paid before the term begins.', 'announcement', 'medium', 'all', 'sent', 450, 380, '2024-01-19 10:15:00+00'),
('a23e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001', 'Sports Day Event', 'Annual sports day will be held on March 15th. Students are encouraged to participate in various sports activities. Registration forms are available at the main office.', 'event', 'low', 'students', 'scheduled', 280, 0, '2024-01-21 11:20:00+00');

-- ============================================================================
-- DEMO FEE STRUCTURES
-- ============================================================================

INSERT INTO fee_structures (id, school_id, name, description, fee_type, amount, frequency, applicable_classes, is_mandatory, academic_year) VALUES
('b23e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', 'Tuition Fee', 'Monthly tuition fee for all students', 'tuition', 500.00, 'monthly', ARRAY['523e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174003'], true, '2024-25'),
('b23e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'Library Fee', 'Annual library and resource fee', 'library', 100.00, 'annually', ARRAY['523e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174003'], true, '2024-25'),
('b23e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', 'Transport Fee', 'Monthly transportation fee', 'transport', 75.00, 'monthly', ARRAY['523e4567-e89b-12d3-a456-426614174002', '523e4567-e89b-12d3-a456-426614174003'], false, '2024-25');

-- ============================================================================
-- DEMO STUDENT FEES
-- ============================================================================

INSERT INTO student_fees (student_id, fee_structure_id, amount, due_date, academic_year, status) VALUES
-- Emma Johnson's fees
('723e4567-e89b-12d3-a456-426614174000', 'b23e4567-e89b-12d3-a456-426614174000', 500.00, '2024-02-01', '2024-25', 'paid'),
('723e4567-e89b-12d3-a456-426614174000', 'b23e4567-e89b-12d3-a456-426614174001', 100.00, '2024-08-15', '2024-25', 'paid'),
('723e4567-e89b-12d3-a456-426614174000', 'b23e4567-e89b-12d3-a456-426614174002', 75.00, '2024-02-01', '2024-25', 'pending'),
-- James Smith's fees
('723e4567-e89b-12d3-a456-426614174001', 'b23e4567-e89b-12d3-a456-426614174000', 500.00, '2024-02-01', '2024-25', 'pending'),
('723e4567-e89b-12d3-a456-426614174001', 'b23e4567-e89b-12d3-a456-426614174001', 100.00, '2024-08-15', '2024-25', 'paid');

-- ============================================================================
-- DEMO BOOKS
-- ============================================================================

INSERT INTO books (id, school_id, isbn, title, author, publisher, publication_year, category, total_copies, available_copies, location, price) VALUES
('c23e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', '978-0-123456-78-9', 'Advanced Mathematics Textbook', 'Dr. John Mathews', 'Education Publishers', 2023, 'Mathematics', 50, 45, 'Section A, Shelf 1', 85.00),
('c23e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', '978-0-234567-89-0', 'Biology: Life Sciences', 'Dr. Sarah Green', 'Science Books Inc', 2022, 'Science', 40, 38, 'Section B, Shelf 2', 92.00),
('c23e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174000', '978-0-345678-90-1', 'World History Chronicles', 'Prof. Michael Past', 'History Press', 2023, 'History', 35, 33, 'Section C, Shelf 1', 78.00),
('c23e4567-e89b-12d3-a456-426614174003', '123e4567-e89b-12d3-a456-426614174000', '978-0-456789-01-2', 'English Literature Anthology', 'Dr. Emma Words', 'Literary Publications', 2022, 'Literature', 45, 42, 'Section D, Shelf 1', 88.00);

-- ============================================================================
-- DEMO BOOK BORROWINGS
-- ============================================================================

INSERT INTO book_borrowings (book_id, borrower_type, borrower_id, borrowed_date, due_date, status, issued_by) VALUES
('c23e4567-e89b-12d3-a456-426614174000', 'student', '723e4567-e89b-12d3-a456-426614174000', '2024-01-15', '2024-02-15', 'borrowed', '223e4567-e89b-12d3-a456-426614174001'),
('c23e4567-e89b-12d3-a456-426614174001', 'student', '723e4567-e89b-12d3-a456-426614174001', '2024-01-18', '2024-02-18', 'borrowed', '223e4567-e89b-12d3-a456-426614174001'),
('c23e4567-e89b-12d3-a456-426614174002', 'teacher', '623e4567-e89b-12d3-a456-426614174003', '2024-01-10', '2024-03-10', 'borrowed', '223e4567-e89b-12d3-a456-426614174001');

-- Update available copies
UPDATE books SET available_copies = available_copies - 1 WHERE id IN ('c23e4567-e89b-12d3-a456-426614174000', 'c23e4567-e89b-12d3-a456-426614174001', 'c23e4567-e89b-12d3-a456-426614174002');

-- ============================================================================
-- DEMO TIMETABLE SLOTS
-- ============================================================================

INSERT INTO timetable_slots (school_id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room_number, academic_term_id) VALUES
-- Grade 10A Monday schedule
('123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', 1, '09:00:00', '10:00:00', '201', '323e4567-e89b-12d3-a456-426614174000'),
('123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174001', '623e4567-e89b-12d3-a456-426614174001', 1, '10:15:00', '11:15:00', '201', '323e4567-e89b-12d3-a456-426614174000'),
('123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174002', 1, '11:30:00', '12:30:00', '201', '323e4567-e89b-12d3-a456-426614174000'),
-- Grade 10A Tuesday schedule
('123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174003', '623e4567-e89b-12d3-a456-426614174003', 2, '09:00:00', '10:00:00', '201', '323e4567-e89b-12d3-a456-426614174000'),
('123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', 2, '10:15:00', '11:15:00', '201', '323e4567-e89b-12d3-a456-426614174000'),
-- Grade 10A Wednesday schedule
('123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174000', '623e4567-e89b-12d3-a456-426614174000', 3, '09:00:00', '10:00:00', '201', '323e4567-e89b-12d3-a456-426614174000'),
('123e4567-e89b-12d3-a456-426614174000', '523e4567-e89b-12d3-a456-426614174002', '423e4567-e89b-12d3-a456-426614174002', '623e4567-e89b-12d3-a456-426614174002', 3, '10:15:00', '11:15:00', '201', '323e4567-e89b-12d3-a456-426614174000');

COMMIT;
