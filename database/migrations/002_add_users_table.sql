-- Add users table for authentication
-- This migration adds a unified users table for authentication

-- Create users table for unified authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'school_admin', 'teacher', 'student', 'parent')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (
  auth.uid()::text = id::text OR 
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'super_admin')
);

CREATE POLICY "Super admins can manage all users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'super_admin')
);

CREATE POLICY "School admins can manage school users" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text 
    AND role = 'school_admin' 
    AND school_id = users.school_id
  )
);

-- Insert demo users with hashed passwords (password: demo123)
-- Note: In production, use proper password hashing
INSERT INTO users (id, email, password_hash, role, first_name, last_name, school_id, is_active) VALUES
-- Super Admin
('a0000000-0000-0000-0000-000000000001', 'superadmin@schoolnexus.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGpnfgKQCNpG6aGS', 'super_admin', 'Super', 'Admin', NULL, true),
-- School Admin
('a0000000-0000-0000-0000-000000000002', 'admin@schoolnexus.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGpnfgKQCNpG6aGS', 'school_admin', 'School', 'Admin', '123e4567-e89b-12d3-a456-426614174000', true),
-- Teacher
('a0000000-0000-0000-0000-000000000003', 'teacher@schoolnexus.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGpnfgKQCNpG6aGS', 'teacher', 'John', 'Teacher', '123e4567-e89b-12d3-a456-426614174000', true),
-- Student
('a0000000-0000-0000-0000-000000000004', 'student@schoolnexus.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGpnfgKQCNpG6aGS', 'student', 'Jane', 'Student', '123e4567-e89b-12d3-a456-426614174000', true),
-- Parent
('a0000000-0000-0000-0000-000000000005', 'parent@schoolnexus.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGpnfgKQCNpG6aGS', 'parent', 'Parent', 'User', NULL, true);

-- Create sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- Create trigger for sessions updated_at
CREATE TRIGGER update_user_sessions_updated_at 
  BEFORE UPDATE ON user_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for password reset tokens
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_expires ON password_reset_tokens(expires_at);

-- Enable RLS for password reset tokens
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for email verification tokens
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON email_verification_tokens(expires_at);

-- Enable RLS for email verification tokens
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
  DELETE FROM password_reset_tokens WHERE expires_at < NOW();
  DELETE FROM email_verification_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Update existing role tables to reference users table (optional foreign keys)
-- This allows for gradual migration while maintaining backwards compatibility

-- Add user_id columns to existing tables if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'administrators' AND column_name = 'user_id') THEN
    ALTER TABLE administrators ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'user_id') THEN
    ALTER TABLE teachers ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'user_id') THEN
    ALTER TABLE students ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'parents' AND column_name = 'user_id') THEN
    ALTER TABLE parents ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

COMMIT;
