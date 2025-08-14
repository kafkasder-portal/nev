import { ReactNode, useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
  requiredPermissions?: string[]
}

export function ProtectedRoute({ 
  children, 
  requiredRole: _requiredRole, 
  requiredPermissions: _requiredPermissions = [] 
}: ProtectedRouteProps) {
  const { user: _user, session: _session, profile: _profile, initializing, initialize } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  // const _location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      if (initializing) {
        await initialize()
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [initializing, initialize])

  // Show loading spinner while checking authentication
  if (isChecking || initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Kimlik doğrulanıyor...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  // GEÇICI: Login kontrolü devre dışı
  // if (!session || !user) {
  //   return <Navigate to="/login" state={{ from: location }} replace />
  // }

  // Check if user account is active
  // GEÇICI: Profil aktiflik kontrolü devre dışı
  // if (profile && !profile.is_active) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="text-center space-y-4 max-w-md mx-auto p-6">
  //         <h2 className="text-2xl font-bold text-destructive">Hesap Deaktif</h2>
  //         <p className="text-muted-foreground">
  //           Hesabınız deaktif edilmiştir. Erişim için sistem yöneticisiyle iletişime geçin.
  //         </p>
  //         <button
  //           onClick={() => useAuthStore.getState().signOut()}
  //           className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
  //         >
  //           Çıkış Yap
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  // Check role requirement
  // GEÇICI: Rol kontrolü devre dışı
  // if (requiredRole && profile?.role !== requiredRole) {
  //   // Check role hierarchy
  //   const roleHierarchy = ['viewer', 'operator', 'coordinator', 'manager', 'admin', 'super_admin']
  //   const userRoleIndex = roleHierarchy.indexOf(profile?.role || 'viewer')
  //   const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

  //   if (userRoleIndex < requiredRoleIndex) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-background">
  //         <div className="text-center space-y-4 max-w-md mx-auto p-6">
  //           <h2 className="text-2xl font-bold text-destructive">Erişim Engellendi</h2>
  //           <p className="text-muted-foreground">
  //             Bu sayfaya erişim için {requiredRole} yetkisi gereklidir.
  //           </p>
  //           <button
  //             onClick={() => window.history.back()}
  //             className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
  //           >
  //             Geri Dön
  //           </button>
  //         </div>
  //       </div>
  //     )
  //   }
  // }

  // Check specific permissions
  // GEÇICI: İzin kontrolü devre dışı
  // if (requiredPermissions.length > 0) {
  //   // For now, we'll use a simple role-based permission check
  //   // This can be expanded to use the permissions system
  //   const hasPermissions = requiredPermissions.every(permission => {
  //     // Super admin has all permissions
  //     if (profile?.role === 'super_admin') return true
  //     
  //     // Basic permission mapping (can be expanded)
  //     const rolePermissions: Record<string, string[]> = {
  //       admin: ['manage_users', 'manage_meetings', 'manage_tasks', 'manage_messages'],
  //       manager: ['manage_meetings', 'manage_tasks', 'view_users'],
  //       coordinator: ['create_meetings', 'create_tasks', 'view_meetings', 'view_tasks'],
  //       operator: ['view_meetings', 'view_tasks'],
  //       viewer: ['view_dashboard']
  //     }

  //     const userPermissions = rolePermissions[profile?.role || 'viewer'] || []
  //     return userPermissions.includes(permission)
  //   })

  //   if (!hasPermissions) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-background">
  //         <div className="text-center space-y-4 max-w-md mx-auto p-6">
  //           <h2 className="text-2xl font-bold text-destructive">Yetkisiz Erişim</h2>
  //           <p className="text-muted-foreground">
  //             Bu işlemi gerçekleştirmek için gerekli yetkiniz bulunmuyor.
  //           </p>
  //           <button
  //             onClick={() => window.history.back()}
  //             className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
  //           >
  //             Geri Dön
  //           </button>
  //         </div>
  //       </div>
  //     )
  //   }
  // }

  return <>{children}</>
}

// Higher-order component for easier usage
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRole?: string
    requiredPermissions?: string[]
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute 
        requiredRole={options?.requiredRole}
        requiredPermissions={options?.requiredPermissions}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
