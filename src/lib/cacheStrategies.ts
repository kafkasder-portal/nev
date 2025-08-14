import { QueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryClient'

/**
 * Cache stratejileri ve optimistic update helper'ları
 */

// Cache stratejileri
export const cacheStrategies = {
  // Hızlı değişen veriler (1 dakika)
  realTime: {
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  
  // Orta hızda değişen veriler (5 dakika)
  dynamic: {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  
  // Yavaş değişen veriler (30 dakika)
  static: {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  
  // Çok yavaş değişen veriler (2 saat)
  persistent: {
    staleTime: 2 * 60 * 60 * 1000,
    gcTime: 4 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
}

// Optimistic update helper'ları
export const optimisticUpdates = {
  // Liste item'ı ekleme
  addToList: <T extends { id: string | number }>(
    queryKey: readonly unknown[],
    newItem: T
  ) => ({
    queryKey,
    updater: (oldData: any) => {
      if (!oldData) return { items: [newItem], total: 1 }
      return {
        ...oldData,
        items: [newItem, ...oldData.items],
        total: oldData.total + 1,
      }
    },
  }),
  
  // Liste item'ı güncelleme
  updateInList: <T extends { id: string | number }>(
    queryKey: readonly unknown[],
    updatedItem: Partial<T> & { id: string | number }
  ) => ({
    queryKey,
    updater: (oldData: any) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        items: oldData.items.map((item: T) =>
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        ),
      }
    },
  }),
  
  // Liste item'ı silme
  removeFromList: <T extends { id: string | number }>(
    queryKey: readonly unknown[],
    itemId: string | number
  ) => ({
    queryKey,
    updater: (oldData: any) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        items: oldData.items.filter((item: T) => item.id !== itemId),
        total: Math.max(0, oldData.total - 1),
      }
    },
  }),
  
  // Tek item güncelleme
  updateSingle: <T>(
    queryKey: readonly unknown[],
    updatedData: Partial<T>
  ) => ({
    queryKey,
    updater: (oldData: T) => {
      if (!oldData) return oldData
      return { ...oldData, ...updatedData }
    },
  }),
}

// Cache invalidation stratejileri
export const invalidationStrategies = {
  // Kullanıcı işlemleri sonrası
  afterUserOperation: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() })
  },
  
  // Kurum işlemleri sonrası
  afterInstitutionOperation: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.institutions.all() })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() })
  },
  
  // Mesaj işlemleri sonrası
  afterMessageOperation: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.messages.all() })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() })
  },
  
  // Bağış işlemleri sonrası
  afterDonationOperation: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.donations.all() })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() })
  },
  
  // Yardım işlemleri sonrası
  afterAidOperation: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.aid.all() })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() })
  },
  
  // Burs işlemleri sonrası
  afterScholarshipOperation: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.scholarship.all() })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() })
  },
  
  // Auth işlemleri sonrası
  afterAuthOperation: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.permissions() })
    // Tüm cache'i temizle (kullanıcı değişti)
    queryClient.clear()
  },
}

// Background refetch stratejileri
export const backgroundRefetchStrategies = {
  // Kritik veriler için agresif refetch
  critical: {
    refetchInterval: 30 * 1000, // 30 saniye
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  
  // Normal veriler için orta seviye refetch
  normal: {
    refetchInterval: 5 * 60 * 1000, // 5 dakika
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  
  // Statik veriler için minimal refetch
  minimal: {
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
}

// Offline support helper'ları
export const offlineStrategies = {
  // Offline durumunda cache'den veri döndür
  offlineFirst: {
    networkMode: 'offlineFirst' as const,
    retry: (failureCount: number, error: any) => {
      // Network hatası varsa retry yapma
      if (error?.name === 'NetworkError') return false
      return failureCount < 3
    },
  },
  
  // Online durumunda network'ten, offline'da cache'den
  onlineFirst: {
    networkMode: 'online' as const,
    retry: (failureCount: number, error: any) => {
      // Network hatası varsa retry yap
      if (error?.name === 'NetworkError') return failureCount < 2
      return failureCount < 3
    },
  },
  
  // Sadece online durumunda çalış
  onlineOnly: {
    networkMode: 'online' as const,
    retry: false,
  },
}

// Prefetch stratejileri
export const prefetchStrategies = {
  // Dashboard verilerini prefetch et
  prefetchDashboard: async (queryClient: QueryClient) => {
    const promises = [
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.stats(),
        queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
        ...cacheStrategies.dynamic,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.recent(),
        queryFn: () => fetch('/api/dashboard/recent').then(res => res.json()),
        ...cacheStrategies.realTime,
      }),
    ]
    
    await Promise.allSettled(promises)
  },
  
  // Kullanıcı listesini prefetch et
  prefetchUsers: async (queryClient: QueryClient) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.users.list({}),
      queryFn: () => fetch('/api/users').then(res => res.json()),
      ...cacheStrategies.dynamic,
    })
  },
  
  // Kurum listesini prefetch et
  prefetchInstitutions: async (queryClient: QueryClient) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.institutions.list({}),
      queryFn: () => fetch('/api/institutions').then(res => res.json()),
      ...cacheStrategies.static,
    })
  },
}

// Cache warming stratejileri
export const cacheWarmingStrategies = {
  // Uygulama başlangıcında kritik verileri yükle
  warmupCriticalData: async (queryClient: QueryClient) => {
    const promises = [
      prefetchStrategies.prefetchDashboard(queryClient),
      prefetchStrategies.prefetchUsers(queryClient),
      prefetchStrategies.prefetchInstitutions(queryClient),
    ]
    
    await Promise.allSettled(promises)
  },
  
  // Kullanıcı giriş yaptıktan sonra veri yükle
  warmupAfterLogin: async (queryClient: QueryClient) => {
    const promises = [
      queryClient.prefetchQuery({
        queryKey: queryKeys.auth.user(),
        queryFn: () => fetch('/api/auth/user').then(res => res.json()),
        ...cacheStrategies.realTime,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.auth.permissions(),
        queryFn: () => fetch('/api/auth/permissions').then(res => res.json()),
        ...cacheStrategies.static,
      }),
    ]
    
    await Promise.allSettled(promises)
  },
}

// Error recovery stratejileri
export const errorRecoveryStrategies = {
  // Network hatası durumunda retry
  networkErrorRetry: {
    retry: (failureCount: number, error: any) => {
      if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
        return failureCount < 3
      }
      return false
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  
  // Server hatası durumunda retry
  serverErrorRetry: {
    retry: (failureCount: number, error: any) => {
      const status = error?.response?.status || error?.status
      // 5xx hatalarında retry yap
      if (status >= 500 && status < 600) {
        return failureCount < 2
      }
      return false
    },
    retryDelay: (attemptIndex: number) => Math.min(2000 * 2 ** attemptIndex, 10000),
  },
  
  // Auth hatası durumunda retry yapma
  authErrorNoRetry: {
    retry: (failureCount: number, error: any) => {
      const status = error?.response?.status || error?.status
      // 401, 403 hatalarında retry yapma
      if (status === 401 || status === 403) {
        return false
      }
      return failureCount < 2
    },
  },
}