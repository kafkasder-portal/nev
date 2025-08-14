import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export type UserProfile = {
  id: string
  full_name: string
  display_name?: string
  email?: string
  role: string
  department?: string
  position?: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

export type AuthUser = User & {
  profile?: UserProfile
}

type AuthState = {
  user: AuthUser | null
  session: Session | null
  profile: UserProfile | null
  initializing: boolean
  loading: boolean
  error: string | null
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<Session | null>
  signUp: (email: string, password: string, userData: { full_name: string; department?: string; phone?: string }) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  initializing: true,
  loading: false,
  error: null,

  initialize: async () => {
    try {
      set({ initializing: true, error: null })

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        set({ initializing: false, error: sessionError.message })
        return
      }

      if (session?.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          // Create profile if it doesn't exist
          const newProfile: Partial<UserProfile> = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            role: 'viewer',
            is_active: true
          }

          const { data: createdProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert(newProfile)
            .select()
            .single()

          if (createError) {
            console.error('Profile creation error:', createError)
            set({ initializing: false, error: 'Failed to create user profile' })
            return
          }

          set({
            user: { ...session.user, profile: createdProfile },
            session,
            profile: createdProfile,
            initializing: false
          })
        } else {
          // Check if user is active
          if (!profile.is_active) {
            await supabase.auth.signOut()
            set({ 
              user: null, 
              session: null, 
              profile: null, 
              initializing: false, 
              error: 'Account has been deactivated' 
            })
            return
          }

          set({
            user: { ...session.user, profile },
            session,
            profile,
            initializing: false
          })
        }
      } else {
        set({ initializing: false })
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)

        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (!profileError && profile) {
            set({
              user: { ...session.user, profile },
              session,
              profile,
              loading: false,
              error: null
            })
          }
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            session: null,
            profile: null,
            loading: false,
            error: null
          })
        } else if (event === 'TOKEN_REFRESHED' && session) {
          set({ session })
        }
      })

    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ 
        initializing: false, 
        error: error instanceof Error ? error.message : 'Authentication initialization failed' 
      })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        throw error
      }

      if (!data.session) {
        throw new Error('Login failed - no session returned')
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        throw new Error('Failed to fetch user profile')
      }

      // Check if user is active
      if (!profile.is_active) {
        await supabase.auth.signOut()
        throw new Error('Account has been deactivated')
      }

      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id)

      set({
        user: { ...data.user, profile },
        session: data.session,
        profile,
        loading: false,
        error: null
      })

      toast.success('Giriş başarılı!')
      return data.session

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      console.error('Login error:', error)
      
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
      return null
    }
  },

  signUp: async (email: string, password: string, userData: { full_name: string; department?: string; phone?: string }) => {
    try {
      set({ loading: true, error: null })

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error('Registration failed - no user returned')
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          full_name: userData.full_name,
          department: userData.department,
          phone: userData.phone,
          role: 'viewer', // Default role
          is_active: true
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't throw here, user can still use the account
      }

      set({ loading: false, error: null })
      toast.success('Kayıt başarılı! Lütfen email adresinizi kontrol edin.')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      console.error('Registration error:', error)
      
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      set({
        user: null,
        session: null,
        profile: null,
        loading: false,
        error: null
      })

      toast.success('Çıkış yapıldı')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      console.error('Logout error:', error)
      
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      const { user, profile } = get()
      if (!user || !profile) {
        throw new Error('No user logged in')
      }

      set({ loading: true, error: null })

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      const updatedProfile = { ...profile, ...data }
      set({
        profile: updatedProfile,
        user: { ...user, profile: updatedProfile },
        loading: false,
        error: null
      })

      toast.success('Profil güncellendi')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      console.error('Profile update error:', error)
      
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const { user } = get()
      if (!user?.email) {
        throw new Error('No user logged in')
      }

      set({ loading: true, error: null })

      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (verifyError) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw error
      }

      set({ loading: false, error: null })
      toast.success('Şifre değiştirildi')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed'
      console.error('Password change error:', error)
      
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true, error: null })

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      set({ loading: false, error: null })
      toast.success('Şifre sıfırlama bağlantısı email adresinize gönderildi')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      console.error('Password reset error:', error)
      
      set({ loading: false, error: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))
