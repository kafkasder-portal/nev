import {
  Users,
  Coins,
  FileText,
  Heart,
  TrendingUp,
  Calendar,
  MessageSquare,
  PieChart,
  Activity,
  Building2,
  ClipboardList,
  HandHeart,
  BarChart3,
  Briefcase,
  UserCheck,
  CreditCard
} from 'lucide-react'
import { StatCard } from '@components/StatCard'
import { Link } from 'react-router-dom'
import DashboardCharts from '@components/DashboardCharts'

export default function DashboardIndex() {
  return (
    <div className="space-y-6">
      {/* Executive Summary Header */}
      <div className="corporate-card-elevated p-8 bg-gradient-to-r from-corporate-navy to-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Operasyonel Kontrol Merkezi</h1>
            <p className="mt-2 text-white/90 font-medium">
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="hidden sm:block">
            <Activity className="h-16 w-16 text-white/20" />
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Kayıtlı Yararlanıcı Sayısı"
          value="1,247"
          icon={<Users className="h-5 w-5 text-corporate-navy" />} 
          accentClass="bg-blue-100"
          subtitle="+12 bu ay"
        />
        <StatCard
          title="Bekleyen Başvuru Sayısı"
          value="187"
          icon={<FileText className="h-5 w-5 text-warning" />}
          accentClass="bg-orange-100"
          subtitle="Değerlendirme aşamasında"
        />
        <StatCard
          title="Aylık Bağış Geliri"
          value="₺45,670"
          icon={<Coins className="h-5 w-5 text-success" />}
          accentClass="bg-green-100"
          subtitle="Önceki aya göre %15 artış"
        />
        <StatCard
          title="Dağıtılan Yardım Tutarı"
          value="₺38,240"
          icon={<Heart className="h-5 w-5 text-info" />}
          accentClass="bg-blue-100"
          subtitle="Mevcut dönem"
        />
      </div>

      {/* Operasyonel İşlemler */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <QuickAccessCard
          title="Başvuru Kaydı"
          description="Yeni yararlanıcı başvurusu oluşturun"
          icon={<FileText className="h-6 w-6" />}
          color="bg-blue-500"
          link="/aid/applications"
        />
        <QuickAccessCard
          title="Bağış İşlemleri"
          description="Bağış gelirlerini sisteme kaydedin"
          icon={<Coins className="h-6 w-6" />}
          color="bg-green-500"
          link="/donations/cash"
        />
        <QuickAccessCard
          title="İletişim Merkezi"
          description="Toplu bilgilendirme mesajları gönderin"
          icon={<MessageSquare className="h-6 w-6" />}
          color="bg-purple-500"
          link="/messages/bulk-send"
        />
        <QuickAccessCard
          title="Raporlama Sistemi"
          description="Operasyonel raporları oluşturun"
          icon={<PieChart className="h-6 w-6" />}
          color="bg-orange-500"
          link="/aid/reports"
        />
      </div>

      {/* Dashboard Charts */}
      <DashboardCharts />

      {/* Alt Kısım - 3 Sütun */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Son Aktiviteler */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Son Aktiviteler</h3>
          </div>
          <div className="space-y-3">
            <ActivityItem
              title="Yeni başvuru onaylandı"
              subtitle="Ayşe Yılmaz - Nakdi Yardım"
              time="2 saat önce"
            />
            <ActivityItem
              title="Bağış alındı"
              subtitle="₺500 - Ahmet Demir"
              time="4 saat önce"
            />
            <ActivityItem
              title="Toplu mesaj gönderildi"
              subtitle="142 kişiye SMS gönderildi"
              time="6 saat önce"
            />
            <ActivityItem
              title="Yardım dağıtıldı"
              subtitle="₺1,200 - 3 aile"
              time="1 gün önce"
            />
          </div>
          <Link to="/aid" className="mt-4 block text-sm text-primary hover:underline">
            Tüm aktiviteleri gör →
          </Link>
        </div>

        {/* Bu Ayki Hedefler */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Bu Ayki Hedefler</h3>
          </div>
          <div className="space-y-4">
            <ProgressItem
              title="Bağış Hedefi"
              current={45670}
              target={60000}
              unit="₺"
            />
            <ProgressItem
              title="Yardım Dağıtımı"
              current={38240}
              target={45000}
              unit="₺"
            />
            <ProgressItem
              title="Yeni Başvuru"
              current={12}
              target={20}
              unit=""
            />
            <ProgressItem
              title="Burs Öğrenci"
              current={85}
              target={100}
              unit=""
            />
          </div>
        </div>

        {/* Yaklaşan Etkinlikler */}
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Yaklaşan Etkinlikler</h3>
          </div>
          <div className="space-y-3">
            <EventItem
              title="Yönetim Kurulu Toplantısı"
              date="15 Ocak 2024"
              time="14:00"
            />
            <EventItem
              title="Bağış Kampanyası Lansmanı"
              date="20 Ocak 2024"
              time="10:00"
            />
            <EventItem
              title="İhtiyaç Sahipleri Ziyareti"
              date="25 Ocak 2024"
              time="09:00"
            />
            <EventItem
              title="Burs Öğrenci Buluşması"
              date="30 Ocak 2024"
              time="15:00"
            />
          </div>
          <Link to="/messages" className="mt-4 block text-sm text-primary hover:underline">
            Takvimi gör →
          </Link>
        </div>
      </div>
    </div>
  )
}

function QuickAccessCard({ title, description, icon, color, link }: {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  link: string
}) {
  return (
    <Link to={link} className="group block">
      <div className="rounded-lg border bg-card p-4 transition-all hover:border-primary hover:shadow-md">
        <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}>
          {icon}
        </div>
        <h3 className="font-semibold group-hover:text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}

function ActivityItem({ title, subtitle, time }: {
  title: string
  subtitle: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

function ProgressItem({ title, current, target, unit }: {
  title: string
  current: number
  target: number
  unit: string
}) {
  const percentage = Math.round((current / target) * 100)
  
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">
          {unit}{current.toLocaleString('tr-TR')} / {unit}{target.toLocaleString('tr-TR')}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div 
          className="h-2 rounded-full bg-primary transition-all duration-300" 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">%{percentage} tamamlandı</p>
    </div>
  )
}

function EventItem({ title, date, time }: {
  title: string
  date: string
  time: string
}) {
  return (
    <div className="flex items-center gap-3 rounded border p-2">
      <div className="flex h-12 w-12 flex-col items-center justify-center rounded bg-primary/10 text-primary">
        <span className="text-xs font-medium">{date.split(' ')[0]}</span>
        <span className="text-xs">{date.split(' ')[1]}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
