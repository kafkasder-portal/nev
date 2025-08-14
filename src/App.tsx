import { DashboardLayout } from './layouts/DashboardLayout'
import AppRoutes from './routes'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import PWAPrompt from './components/PWAPrompt'
import { SocketProvider } from './contexts/SocketContext'
import { OfflineProvider } from './contexts/OfflineContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ChatContainer from './components/Chat/ChatContainer'
import { useState, useEffect, startTransition } from 'react'
import CommandPalette from './components/CommandPalette'
import AICommandCenter from './components/AICommandCenter'
import { useAICommandCenter } from './hooks/useAICommandCenter'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient, cacheUtils } from './lib/queryClient'
import OfflineIndicator from './components/OfflineIndicator'
import { useAuthStore } from './store/auth'

// Inner component that uses theme-dependent hooks
function AppContent() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isCmdOpen, setIsCmdOpen] = useState(false)
  const { user } = useAuthStore()
  const {
    isOpen: isAIOpen,
    openCommandCenter,
    closeCommandCenter,
    actionContext,
    userId
  } = useAICommandCenter()

  useEffect(() => {
    const open = () => {
      startTransition(() => {
        setIsCmdOpen(true)
      })
    }
    window.addEventListener('open-command-palette', open as any)
    return () => window.removeEventListener('open-command-palette', open as any)
  }, [])

  const toggleChat = () => {
    startTransition(() => {
      setIsChatOpen(!isChatOpen)
    })
  }

  return (
    <DashboardLayout onOpenAICenter={openCommandCenter}>
      <ErrorBoundary level="page">
        <AppRoutes />
      </ErrorBoundary>
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
      <PWAPrompt />
      <OfflineIndicator />
      {user && (
        <ChatContainer
          currentUserId={user.id}
          isOpen={isChatOpen}
          onToggle={toggleChat}
        />
      )}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        toggleChat={toggleChat}
        onOpenAICenter={openCommandCenter}
      />
      <AICommandCenter
        isOpen={isAIOpen}
        onClose={closeCommandCenter}
        context={actionContext}
        userId={userId}
      />
    </DashboardLayout>
  )
}

export default function App() {
  const { initializing, initialize } = useAuthStore()

  // Initialize auth on app start
  useEffect(() => {
    initialize()
  }, [initialize])

  // Cache persistence için offline support
  useEffect(() => {
    // Uygulama başlarken cache'i yükle
    cacheUtils.loadFromStorage()

    // Sayfa kapatılırken cache'i kaydet
    const handleBeforeUnload = () => {
      cacheUtils.saveToStorage()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Show loading screen while initializing auth
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Uygulama yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary level="global" showDetails={process.env.NODE_ENV === 'development'}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <OfflineProvider>
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </OfflineProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
