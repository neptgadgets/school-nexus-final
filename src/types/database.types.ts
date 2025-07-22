export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          logo_url?: string
          created_at: string
          updated_at: string
          is_active: boolean
          subscription_status: 'active' | 'expired' | 'trial'
          subscription_end_date?: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          logo_url?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          subscription_status?: 'active' | 'expired' | 'trial'
          subscription_end_date?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          logo_url?: string
          updated_at?: string
          is_active?: boolean
          subscription_status?: 'active' | 'expired' | 'trial'
          subscription_end_date?: string
        }
      }
      administrators: {
        Row: {
          id: string
          user_id: string
          school_id?: string
          role: 'super_admin' | 'school_admin'
          first_name: string
          last_name: string
          email: string
          phone?: string
          avatar_url?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          school_id?: string
          role: 'super_admin' | 'school_admin'
          first_name: string
          last_name: string
          email: string
          phone?: string
          avatar_url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          school_id?: string
          role?: 'super_admin' | 'school_admin'
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          avatar_url?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          school_id: string
          student_id: string
          first_name: string
          last_name: string
          email?: string
          phone?: string
          parent_phone: string
          parent_email?: string
          address?: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          class_id: string
          admission_date: string
          guardian_name: string
          guardian_relationship: string
          medical_info?: string
          avatar_url?: string
          status: 'active' | 'graduated' | 'transferred' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          student_id: string
          first_name: string
          last_name: string
          email?: string
          phone?: string
          parent_phone: string
          parent_email?: string
          address?: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          class_id: string
          admission_date: string
          guardian_name: string
          guardian_relationship: string
          medical_info?: string
          avatar_url?: string
          status?: 'active' | 'graduated' | 'transferred' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          student_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          parent_phone?: string
          parent_email?: string
          address?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          class_id?: string
          admission_date?: string
          guardian_name?: string
          guardian_relationship?: string
          medical_info?: string
          avatar_url?: string
          status?: 'active' | 'graduated' | 'transferred' | 'suspended'
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type School = Database['public']['Tables']['schools']['Row']
export type Administrator = Database['public']['Tables']['administrators']['Row']
export type Student = Database['public']['Tables']['students']['Row']
