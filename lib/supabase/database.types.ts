export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: string
          subscription_status: string
          subscription_expires_at: string | null
          stripe_customer_id: string | null
          credits_remaining: number
          onboarding_completed: boolean
          email_verified: boolean
          email_verified_at: string | null
          preferences: Json
          role: 'user' | 'admin' | 'moderator' | 'premium_user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_expires_at?: string | null
          stripe_customer_id?: string | null
          credits_remaining?: number
          onboarding_completed?: boolean
          email_verified?: boolean
          email_verified_at?: string | null
          preferences?: Json
          role?: 'user' | 'admin' | 'moderator' | 'premium_user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_expires_at?: string | null
          stripe_customer_id?: string | null
          credits_remaining?: number
          onboarding_completed?: boolean
          email_verified?: boolean
          email_verified_at?: string | null
          preferences?: Json
          role?: 'user' | 'admin' | 'moderator' | 'premium_user'
          created_at?: string
          updated_at?: string
        }
      }
      role_permissions: {
        Row: {
          id: string
          role: 'user' | 'admin' | 'moderator' | 'premium_user'
          permission: string
          resource: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          role: 'user' | 'admin' | 'moderator' | 'premium_user'
          permission: string
          resource: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'user' | 'admin' | 'moderator' | 'premium_user'
          permission?: string
          resource?: string
          action?: string
          created_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          template_id: string
          status: string
          personal_info: Json
          professional_summary: string | null
          work_experience: Json
          education: Json
          skills: Json
          projects: Json
          certifications: Json
          languages: Json
          volunteer_experience: Json
          awards: Json
          publications: Json
          references: Json
          custom_sections: Json
          ai_optimized: boolean
          ai_optimization_score: number | null
          ats_score: number | null
          last_ai_optimization: string | null
          is_public: boolean
          view_count: number
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          template_id?: string
          status?: string
          personal_info?: Json
          professional_summary?: string | null
          work_experience?: Json
          education?: Json
          skills?: Json
          projects?: Json
          certifications?: Json
          languages?: Json
          volunteer_experience?: Json
          awards?: Json
          publications?: Json
          references?: Json
          custom_sections?: Json
          ai_optimized?: boolean
          ai_optimization_score?: number | null
          ats_score?: number | null
          last_ai_optimization?: string | null
          is_public?: boolean
          view_count?: number
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          template_id?: string
          status?: string
          personal_info?: Json
          professional_summary?: string | null
          work_experience?: Json
          education?: Json
          skills?: Json
          projects?: Json
          certifications?: Json
          languages?: Json
          volunteer_experience?: Json
          awards?: Json
          publications?: Json
          references?: Json
          custom_sections?: Json
          ai_optimized?: boolean
          ai_optimization_score?: number | null
          ats_score?: number | null
          last_ai_optimization?: string | null
          is_public?: boolean
          view_count?: number
          download_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          industry: string[]
          experience_level: string[]
          config: Json
          preview_image_url: string | null
          thumbnail_url: string | null
          is_premium: boolean
          price_cents: number
          usage_count: number
          rating: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          category?: string
          industry?: string[]
          experience_level?: string[]
          config?: Json
          preview_image_url?: string | null
          thumbnail_url?: string | null
          is_premium?: boolean
          price_cents?: number
          usage_count?: number
          rating?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          industry?: string[]
          experience_level?: string[]
          config?: Json
          preview_image_url?: string | null
          thumbnail_url?: string | null
          is_premium?: boolean
          price_cents?: number
          usage_count?: number
          rating?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      user_permissions_view: {
        Row: {
          user_id: string
          email: string
          full_name: string | null
          role: 'user' | 'admin' | 'moderator' | 'premium_user'
          permission: string
          resource: string
          action: string
        }
      }
    }
    Functions: {
      check_usage_limit: {
        Args: {
          user_uuid: string
          limit_type: string
        }
        Returns: boolean
      }
      reset_monthly_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_user_permission: {
        Args: {
          user_uuid: string
          required_permission: string
          resource_name: string
          action_name: string
        }
        Returns: boolean
      }
      get_user_role: {
        Args: {
          user_uuid: string
        }
        Returns: 'user' | 'admin' | 'moderator' | 'premium_user'
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
