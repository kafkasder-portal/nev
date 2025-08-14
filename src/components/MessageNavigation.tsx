import React from 'react'
import { 
  Mail, 
  Send, 
  Users, 
  FileText, 
  MessageSquare, 
  Smartphone,
  Info,
  BarChart3
} from 'lucide-react'

interface NavigationItem {
  title: string
  href: string
  icon: React.ReactNode
  description: string
  isActive?: boolean
}

interface MessageNavigationProps {
  currentPath?: string
}

export default function MessageNavigation({ currentPath = '/messages' }: MessageNavigationProps) {
  const navigationItems: NavigationItem[] = [
    {
      title: "Mesaj Listesi",
      href: "/messages",
      icon: <Mail className="h-4 w-4" />,
      description: "Tüm mesajları görüntüle ve yönet",
      isActive: currentPath === '/messages'
    },
    {
      title: "Toplu Gönderim",
      href: "/messages/bulk-send",
      icon: <Send className="h-4 w-4" />,
      description: "Toplu mesaj gönderimi yap",
      isActive: currentPath === '/messages/bulk-send'
    },
    {
      title: "Gruplar",
      href: "/messages/groups",
      icon: <Users className="h-4 w-4" />,
      description: "Mesaj gruplarını yönet",
      isActive: currentPath === '/messages/groups'
    },
    {
      title: "Şablonlar",
      href: "/messages/templates",
      icon: <FileText className="h-4 w-4" />,
      description: "Mesaj şablonlarını düzenle",
      isActive: currentPath === '/messages/templates'
    },
    {
      title: "SMS Gönderimleri",
      href: "/messages/sms-deliveries",
      icon: <Smartphone className="h-4 w-4" />,
      description: "SMS gönderim geçmişi",
      isActive: currentPath === '/messages/sms-deliveries'
    },
    {
      title: "E-posta Gönderimleri",
      href: "/messages/email-deliveries",
      icon: <MessageSquare className="h-4 w-4" />,
      description: "E-posta gönderim geçmişi",
      isActive: currentPath === '/messages/email-deliveries'
    },
    {
      title: "Analitik",
      href: "/messages/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Mesaj performans raporları",
      isActive: currentPath === '/messages/analytics'
    },
    {
      title: "Modül Bilgileri",
      href: "/messages/info",
      icon: <Info className="h-4 w-4" />,
      description: "Modül hakkında bilgi",
      isActive: currentPath === '/messages/info'
    }
  ]

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Mesaj Yönetimi</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {navigationItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`group p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
              item.isActive 
                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                item.isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm ${
                  item.isActive ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${
                  item.isActive ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
