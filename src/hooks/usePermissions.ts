import { useMemo } from 'react'
import { useAuthStore } from '../store/auth'

export type Permission = 
  // User Management
  | 'view_users'
  | 'create_user'
  | 'edit_user'
  | 'delete_user'
  | 'manage_user_roles'
  // Meeting Management
  | 'view_meetings'
  | 'create_meeting'
  | 'edit_meeting'
  | 'delete_meeting'
  | 'manage_meeting_participants'
  // Task Management
  | 'view_tasks'
  | 'create_task'
  | 'edit_task'
  | 'delete_task'
  | 'assign_tasks'
  // Message Management
  | 'view_messages'
  | 'send_messages'
  | 'manage_conversations'
  | 'moderate_messages'
  // System
  | 'view_dashboard'
  | 'access_admin_panel'
  | 'manage_system_settings'
  | 'view_audit_logs'
  // Financial
  | 'view_financial_data'
  | 'manage_donations'
  | 'manage_aid_distribution'
  // Reports
  | 'view_reports'
  | 'export_data'

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'coordinator' | 'operator' | 'viewer'

// Define permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // All permissions
    'view_users', 'create_user', 'edit_user', 'delete_user', 'manage_user_roles',
    'view_meetings', 'create_meeting', 'edit_meeting', 'delete_meeting', 'manage_meeting_participants',
    'view_tasks', 'create_task', 'edit_task', 'delete_task', 'assign_tasks',
    'view_messages', 'send_messages', 'manage_conversations', 'moderate_messages',
    'view_dashboard', 'access_admin_panel', 'manage_system_settings', 'view_audit_logs',
    'view_financial_data', 'manage_donations', 'manage_aid_distribution',
    'view_reports', 'export_data'
  ],
  admin: [
    // Most permissions except super admin specific ones
    'view_users', 'create_user', 'edit_user', 'manage_user_roles',
    'view_meetings', 'create_meeting', 'edit_meeting', 'delete_meeting', 'manage_meeting_participants',
    'view_tasks', 'create_task', 'edit_task', 'delete_task', 'assign_tasks',
    'view_messages', 'send_messages', 'manage_conversations', 'moderate_messages',
    'view_dashboard', 'access_admin_panel', 'view_audit_logs',
    'view_financial_data', 'manage_donations', 'manage_aid_distribution',
    'view_reports', 'export_data'
  ],
  manager: [
    // Management level permissions
    'view_users', 'edit_user',
    'view_meetings', 'create_meeting', 'edit_meeting', 'manage_meeting_participants',
    'view_tasks', 'create_task', 'edit_task', 'assign_tasks',
    'view_messages', 'send_messages', 'manage_conversations',
    'view_dashboard',
    'view_financial_data', 'manage_aid_distribution',
    'view_reports', 'export_data'
  ],
  coordinator: [
    // Coordination level permissions
    'view_users',
    'view_meetings', 'create_meeting', 'edit_meeting',
    'view_tasks', 'create_task', 'edit_task',
    'view_messages', 'send_messages',
    'view_dashboard',
    'view_financial_data',
    'view_reports'
  ],
  operator: [
    // Operational level permissions
    'view_meetings', 'create_meeting',
    'view_tasks', 'create_task',
    'view_messages', 'send_messages',
    'view_dashboard',
    'view_reports'
  ],
  viewer: [
    // Basic viewing permissions
    'view_meetings',
    'view_tasks',
    'view_messages',
    'view_dashboard'
  ]
}

export function usePermissions() {
  const { user, profile } = useAuthStore()

  // YETKİ KONTROLÜ KALDIRILDI - TÜM İZİNLER AÇIK
  const permissions = useMemo(() => {
    // Tüm izinleri döndür
    return Object.values(ROLE_PERMISSIONS.super_admin)
  }, [user, profile])

  const hasPermission = (_permission: Permission): boolean => {
    // Her zaman true döndür
    return true
  }

  const hasAllPermissions = (_requiredPermissions: Permission[]): boolean => {
    // Her zaman true döndür
    return true
  }

  const hasAnyPermission = (_requiredPermissions: Permission[]): boolean => {
    // Her zaman true döndür
    return true
  }

  // Role hierarchy check
  const hasRoleOrHigher = (_requiredRole: UserRole): boolean => {
    // Her zaman true döndür
    return true
  }

  // Convenience getters for common permission checks - TÜM YETKİLER AÇIK
  const canManageUsers = true
  const canManageMeetings = true
  const canManageTasks = true
  const canAccessAdmin = true
  const canViewFinancial = true
  const canExportData = true

  // Check if user is admin level or higher - TÜM KULLANICILAR ADMİN
  const isAdmin = true
  const isSuperAdmin = true

  // Legacy can method for backward compatibility - HER ZAMAN TRUE
  const can = (_permission: string): boolean => {
    // Tüm izinler için true döndür
    return true
  }

  return {
    // Core data
    permissions,
    userRole: profile?.role as UserRole,
    
    // Permission checking functions
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRoleOrHigher,
    can, // Legacy method for backward compatibility
    
    // Convenience flags
    canManageUsers,
    canManageMeetings,
    canManageTasks,
    canAccessAdmin,
    canViewFinancial,
    canExportData,
    isAdmin,
    isSuperAdmin,
    
    // User info
    userId: user?.id,
    userName: profile?.full_name,
    userEmail: user?.email,
    userDepartment: profile?.department
  }
}

// Hook for checking specific permissions in components - HER ZAMAN TRUE
export function useRequirePermission(_permission: Permission) {
  return true
}

// Hook for checking role requirements - HER ZAMAN TRUE
export function useRequireRole(_role: UserRole) {
  return true
}
