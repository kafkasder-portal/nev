import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { queryKeys } from '../lib/queryClient'
import { cacheStrategies } from '../lib/cacheStrategies'
import { toast } from 'sonner'

/**
 * React Query tabanlı API hook'ları
 */

// Generic API query hook
export const useApiQuery = <T = any>(
  key: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: {
    enabled?: boolean
    strategy?: keyof typeof cacheStrategies
    onSuccess?: (data: T) => void
    onError?: (error: any) => void
  }
) => {
  const strategy = options?.strategy ? cacheStrategies[options.strategy] : cacheStrategies.dynamic
  
  return useQuery({
    queryKey: key,
    queryFn,
    enabled: options?.enabled,
    ...strategy,
    meta: {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    },
  })
}

// Generic API mutation hook
export const useApiMutation = <TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: any, variables: TVariables) => void
    onSettled?: (data: TData | undefined, error: any, variables: TVariables) => void
    invalidateQueries?: readonly unknown[][]
    optimisticUpdate?: {
      queryKey: readonly unknown[]
      updater: (oldData: any, variables: TVariables) => any
    }
    successMessage?: string
    errorMessage?: string
  }
) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      if (options?.optimisticUpdate) {
        await queryClient.cancelQueries({ queryKey: options.optimisticUpdate.queryKey })
        const previousData = queryClient.getQueryData(options.optimisticUpdate.queryKey)
        queryClient.setQueryData(
          options.optimisticUpdate.queryKey,
          options.optimisticUpdate.updater(previousData, variables)
        )
        return { previousData }
      }
    },
    onSuccess: (data, variables) => {
      options?.onSuccess?.(data, variables)
      
      // Invalidate specified queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
      
      if (options?.successMessage) {
        toast.success(options.successMessage)
      }
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (options?.optimisticUpdate && context?.previousData) {
        queryClient.setQueryData(options.optimisticUpdate.queryKey, context.previousData)
      }
      
      options?.onError?.(error, variables)
      toast.error(options?.errorMessage || 'İşlem başarısız oldu')
    },
    onSettled: options?.onSettled,
  })
}

// Paginated query hook
export const usePaginatedQuery = <T = any>(
  baseKey: readonly unknown[],
  queryFn: (page: number, filters?: any) => Promise<{ items: T[]; total: number; page: number; totalPages: number }>,
  options?: {
    initialPage?: number
    pageSize?: number
    filters?: any
    enabled?: boolean
    strategy?: keyof typeof cacheStrategies
  }
) => {
  const [page, setPage] = useState(options?.initialPage ?? 1)
  const [filters, setFilters] = useState(options?.filters ?? {})
  
  const queryKey = [...baseKey, { page, filters }]
  const strategy = options?.strategy ? cacheStrategies[options.strategy] : cacheStrategies.dynamic
  
  const query = useQuery({
    queryKey,
    queryFn: () => queryFn(page, filters),
    enabled: options?.enabled,
    ...strategy,
    placeholderData: (previousData) => previousData,
  })
  
  const nextPage = () => {
    if (query.data && page < query.data.totalPages) {
      setPage(prev => prev + 1)
    }
  }
  
  const previousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  }
  
  const goToPage = (newPage: number) => {
    if (query.data && newPage >= 1 && newPage <= query.data.totalPages) {
      setPage(newPage)
    }
  }
  
  return {
    ...query,
    page,
    nextPage,
    previousPage,
    goToPage,
    setFilters,
    hasNextPage: query.data ? page < query.data.totalPages : false,
    hasPreviousPage: page > 1,
  }
}

// Infinite query hook
export const useInfiniteApiQuery = <T = any>(
  key: readonly unknown[],
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{ items: T[]; nextPage?: number; hasMore: boolean }>,
  options?: {
    enabled?: boolean
    initialPageParam?: number
    strategy?: keyof typeof cacheStrategies
  }
) => {
  const strategy = options?.strategy ? cacheStrategies[options.strategy] : cacheStrategies.dynamic
  
  return useInfiniteQuery({
    queryKey: key,
    queryFn,
    initialPageParam: options?.initialPageParam ?? 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: options?.enabled,
    ...strategy,
  })
}

// Specific hooks for different entities

// Users
export const useUsers = (filters: Record<string, any> = {}) => {
  return useApiQuery(
    queryKeys.users.lists(),
    () => fetch(`/api/users?${new URLSearchParams(filters as any)}`).then(res => res.json())
  )
}

export const useUsersCount = (filters: Record<string, any> = {}) => {
  return useApiQuery(
    queryKeys.users.count(),
    () => fetch(`/api/users/count?${new URLSearchParams(filters as any)}`).then(res => res.json())
  )
}



export const useUser = (id: string, options: any = {}) => {
  return useApiQuery(
    queryKeys.users.detail(id),
    () => fetch(`/api/users/${id}`).then(res => res.json()),
    options
  )
}

export const useCreateUser = () => {
  return useApiMutation(
    (userData: any) => fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),
    {
      successMessage: 'Kullanıcı başarıyla oluşturuldu',
      invalidateQueries: [queryKeys.users.all()] as any,
    }
  )
}

export const useUpdateUser = () => {
  return useApiMutation(
    ({ id, ...userData }: any) => fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),
    {
      successMessage: 'Kullanıcı başarıyla güncellendi',
      invalidateQueries: [queryKeys.users.all()] as any,
      optimisticUpdate: {
        queryKey: queryKeys.users.lists(),
        updater: (oldData: any, variables: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            items: oldData.items.map((user: any) =>
              user.id === variables.id ? { ...user, ...variables } : user
            ),
          }
        },
      },
    }
  )
}

export const useDeleteUser = () => {
  return useApiMutation(
    (id: string) => fetch(`/api/users/${id}`, { method: 'DELETE' }).then(res => res.json()),
    {
      successMessage: 'Kullanıcı başarıyla silindi',
      invalidateQueries: [queryKeys.users.all()] as any,
      optimisticUpdate: {
        queryKey: queryKeys.users.lists(),
        updater: (oldData: any, id: string) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            items: oldData.items.filter((user: any) => user.id !== id),
            total: oldData.total - 1,
          }
        },
      },
    }
  )
}

// Institutions
export const useInstitutions = (filters: Record<string, any> = {}) => {
  return useApiQuery(
    queryKeys.institutions.lists(),
    () => fetch(`/api/institutions?${new URLSearchParams(filters as any)}`).then(res => res.json())
  )
}

export const useInstitutionsCount = (filters: Record<string, any> = {}) => {
  return useApiQuery(
    queryKeys.institutions.count(),
    () => fetch(`/api/institutions/count?${new URLSearchParams(filters as any)}`).then(res => res.json())
  )
}



export const useInstitution = (id: string, options: any = {}) => {
  return useApiQuery(
    queryKeys.institutions.detail(id),
    () => fetch(`/api/institutions/${id}`).then(res => res.json()),
    options
  )
}

export const useCreateInstitution = () => {
  return useApiMutation(
    (institutionData: any) => fetch('/api/institutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(institutionData),
    }).then(res => res.json()),
    {
      successMessage: 'Kurum başarıyla oluşturuldu',
      invalidateQueries: [queryKeys.institutions.all()] as any,
    }
  )
}

export const useUpdateInstitution = () => {
  return useApiMutation(
    ({ id, ...institutionData }: any) => fetch(`/api/institutions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(institutionData),
    }).then(res => res.json()),
    {
      successMessage: 'Kurum başarıyla güncellendi',
      invalidateQueries: [queryKeys.institutions.all()] as any,
    }
  )
}

export const useDeleteInstitution = () => {
  return useApiMutation(
    (id: string) => fetch(`/api/institutions/${id}`, { method: 'DELETE' }).then(res => res.json()),
    {
      successMessage: 'Kurum başarıyla silindi',
      invalidateQueries: [queryKeys.institutions.all()] as any,
    }
  )
}

// Message Templates
export const useMessageTemplates = (filters: Record<string, any> = {}) => {
  return useApiQuery(
    queryKeys.messages.templates.lists(),
    () => fetch(`/api/messages/templates?${new URLSearchParams(filters as any)}`).then(res => res.json())
  )
}

export const useMessageTemplatesCount = (filters: Record<string, any> = {}) => {
  return useApiQuery(
    queryKeys.messages.templates.count(),
    () => fetch(`/api/messages/templates/count?${new URLSearchParams(filters as any)}`).then(res => res.json())
  )
}



export const useMessageTemplate = (id: string, options: any = {}) => {
  return useApiQuery(
    queryKeys.messages.templates.detail(id),
    () => fetch(`/api/messages/templates/${id}`).then(res => res.json()),
    options
  )
}

export const useCreateMessageTemplate = () => {
  return useApiMutation(
    (templateData: any) => fetch('/api/messages/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData),
    }).then(res => res.json()),
    {
      successMessage: 'Şablon başarıyla oluşturuldu',
      invalidateQueries: [queryKeys.messages.templates.all()] as any,
    }
  )
}

export const useUpdateMessageTemplate = () => {
  return useApiMutation(
    ({ id, ...templateData }: any) => fetch(`/api/messages/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData),
    }).then(res => res.json()),
    {
      successMessage: 'Şablon başarıyla güncellendi',
      invalidateQueries: [queryKeys.messages.templates.all()] as any,
    }
  )
}

export const useDeleteMessageTemplate = () => {
  return useApiMutation(
    (id: string) => fetch(`/api/messages/templates/${id}`, { method: 'DELETE' }).then(res => res.json()),
    {
      successMessage: 'Şablon başarıyla silindi',
      invalidateQueries: [queryKeys.messages.templates.all()] as any,
    }
  )
}

// Dashboard
export const useDashboardStats = (options?: CacheQueryOptions) =>
  useApiQuery(
    queryKeys.dashboard.stats(),
    () => fetch('/api/dashboard/stats').then(res => res.json()),
    { ...options, strategy: 'dynamic' } // 2 dakika cache
  )

export const useDashboardCharts = (options?: CacheQueryOptions) =>
  useApiQuery(
    queryKeys.dashboard.charts(),
    () => fetch('/api/dashboard/charts').then(res => res.json()),
    { ...options, strategy: 'static' } // 5 dakika cache
  )

export const useDashboardRecentActivities = (options?: CacheQueryOptions) =>
  useApiQuery(
    queryKeys.dashboard.recent(),
    () => fetch('/api/dashboard/recent-activities').then(res => res.json()),
    { ...options, strategy: 'realTime' } // 1 dakika cache
  )

// Alias exports for backward compatibility
export const useUserMutation = useCreateUser
export const useInstitutionMutation = useCreateInstitution