import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  Mail,
  Coins,
  GraduationCap,
  HelpingHand,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Home,
  FileText,
  Wallet,
  CreditCard,
  DollarSign,
  Package,
  Users,
  Building2,
  Settings,
  Database,
  Info,
  Send,
  Star,
  MessageSquare,
  Smartphone,
  AtSign,
  TrendingUp,
  MapPin,
  Building,
  Activity,
  Receipt,
  Layers,
  Shield,
  AlertTriangle,
  Network,
  UserCheck,
  Phone,
  Workflow,
  Globe,
  Truck,
  Languages,
  Type,
  Calendar,
  CheckSquare
} from 'lucide-react'

export function Sidebar() {
  const location = useLocation()
  const [isAidExpanded, setIsAidExpanded] = useState(location.pathname.startsWith('/aid'))
  const [isMessagesExpanded, setIsMessagesExpanded] = useState(location.pathname.startsWith('/messages'))
  const [isDonationsExpanded, setIsDonationsExpanded] = useState(location.pathname.startsWith('/donations'))
  const [isScholarshipExpanded, setIsScholarshipExpanded] = useState(location.pathname.startsWith('/scholarship'))
  const [isFundExpanded, setIsFundExpanded] = useState(location.pathname.startsWith('/fund'))
  const [isSystemExpanded, setIsSystemExpanded] = useState(location.pathname.startsWith('/system'))
  const [isDefinitionsExpanded, setIsDefinitionsExpanded] = useState(location.pathname.startsWith('/definitions'))
  
  const item = (to: string, icon: React.JSX.Element, label: string, isSubItem = false) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-white/15 text-white shadow-sm border-l-2 border-white/30'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        } ${isSubItem ? 'ml-4 text-xs' : ''}`
      }
    >
      <div className={`${isSubItem ? 'opacity-75' : ''}`}>{icon}</div>
      <span className="truncate">{label}</span>
    </NavLink>
  )

  const expandableItem = (icon: React.JSX.Element, label: string, isExpanded: boolean, onToggle: () => void) => (
    <div>
      <div
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer text-white/80 hover:text-white group"
        onClick={onToggle}
      >
        {icon}
        <span className="flex-1 truncate">{label}</span>
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          <ChevronDown className="h-4 w-4 opacity-60 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  )

  const aidSubItems = [
    // Dashboard item removed
    { to: '/aid/beneficiaries', icon: <Users className="h-4 w-4" />, label: 'İhtiyaç Sahipleri' },
    { to: '/aid/applications', icon: <FileText className="h-4 w-4" />, label: 'Yardım Başvuruları' },
    { to: '/aid/cash-vault', icon: <Wallet className="h-4 w-4" />, label: 'Nakdi Yardım Veznesi' },
    { to: '/aid/bank-orders', icon: <CreditCard className="h-4 w-4" />, label: 'Banka Ödeme Emirleri' },
    { to: '/aid/cash-operations', icon: <DollarSign className="h-4 w-4" />, label: 'Nakdi Yardım İ��lemleri' },
    { to: '/aid/in-kind-operations', icon: <Package className="h-4 w-4" />, label: 'Ayni Yardım İşlemleri' },
    { to: '/aid/service-tracking', icon: <Users className="h-4 w-4" />, label: 'Hizmet Takip İşlemleri' },
    { to: '/aid/hospital-referrals', icon: <Building2 className="h-4 w-4" />, label: 'Hastane Sevk İşlemleri' },
    { to: '/aid/reports', icon: <BarChart3 className="h-4 w-4" />, label: 'Raporlar' },
    { to: '/aid/parameters', icon: <Settings className="h-4 w-4" />, label: 'Parametreler' },
    { to: '/aid/data-control', icon: <Database className="h-4 w-4" />, label: 'Veri Kontrolü' },
    { to: '/aid/module-info', icon: <Info className="h-4 w-4" />, label: 'Modül Bilgilendirme' }
  ]

  const donationsSubItems = [
    { to: '/donations', icon: <BarChart3 className="h-4 w-4" />, label: 'Bağış Listesi' },
    { to: '/donations/vault', icon: <Wallet className="h-4 w-4" />, label: 'Bağış Veznesi' },
    { to: '/donations/institutions', icon: <Users className="h-4 w-4" />, label: 'Kurumlar' },
    { to: '/donations/cash', icon: <DollarSign className="h-4 w-4" />, label: 'Nakit Bağışlar' },
    { to: '/donations/bank', icon: <CreditCard className="h-4 w-4" />, label: 'Banka Bağışları' },
    { to: '/donations/credit-card', icon: <CreditCard className="h-4 w-4" />, label: 'Kredi Kartı Bağışları' },
    { to: '/donations/online', icon: <AtSign className="h-4 w-4" />, label: 'Online Bağışlar' },
    { to: '/donations/numbers', icon: <FileText className="h-4 w-4" />, label: 'Bağış Numaraları' },
    { to: '/donations/funding-definitions', icon: <Settings className="h-4 w-4" />, label: 'Fonlama Tanımları' },
    { to: '/donations/sacrifice-periods', icon: <Star className="h-4 w-4" />, label: 'Kurban Dönemleri' },
    { to: '/donations/sacrifice-shares', icon: <Package className="h-4 w-4" />, label: 'Kurban Hisseleri' },
    { to: '/donations/ramadan-periods', icon: <Star className="h-4 w-4" />, label: 'Ramazan Dönemleri' },
    { to: '/donations/piggy-bank-tracking', icon: <Database className="h-4 w-4" />, label: 'Kumbara Takibi' },
    { to: '/donations/bulk-provisioning', icon: <Send className="h-4 w-4" />, label: 'Toplu Provizyon' }
  ]

  const messagesSubItems = [
    { to: '/messages', icon: <Mail className="h-4 w-4" />, label: 'Mesaj Yönetimi' },
    { to: '/messages/bulk-send', icon: <Send className="h-4 w-4" />, label: 'Toplu Mesaj Gönderimi' },
    { to: '/messages/groups', icon: <Star className="h-4 w-4" />, label: 'Mesaj Grupları' },
    { to: '/messages/templates', icon: <MessageSquare className="h-4 w-4" />, label: 'Mesaj Şablonları' },
    { to: '/messages/sms-deliveries', icon: <Smartphone className="h-4 w-4" />, label: 'SMS Gönderimleri' },
    { to: '/messages/email-deliveries', icon: <AtSign className="h-4 w-4" />, label: 'e-Posta Gönderimleri' },
    { to: '/messages/module-info', icon: <Info className="h-4 w-4" />, label: 'Modül Bilgilendirme' }
  ]

  const scholarshipSubItems = [
    { to: '/scholarship', icon: <Users className="h-4 w-4" />, label: 'Yetimler & Öğrenciler' },
    { to: '/scholarship/visual-management', icon: <FileText className="h-4 w-4" />, label: 'Görsel Yönetimi' },
    { to: '/scholarship/definitions', icon: <Settings className="h-4 w-4" />, label: 'Tanımlamalar' },
    { to: '/scholarship/tracking-categories', icon: <Star className="h-4 w-4" />, label: 'Takip Kategorileri' },
    { to: '/scholarship/orphan-form', icon: <FileText className="h-4 w-4" />, label: 'Yetim Bilgi Formu' },
    { to: '/scholarship/orphan-letters', icon: <Mail className="h-4 w-4" />, label: 'Yetim Mektupları' },
    { to: '/scholarship/campaigns', icon: <Star className="h-4 w-4" />, label: 'Kampanyalar' },
    { to: '/scholarship/schools', icon: <GraduationCap className="h-4 w-4" />, label: 'Okullar' },
    { to: '/scholarship/form-definitions', icon: <FileText className="h-4 w-4" />, label: 'Form Tanımları' },
    { to: '/scholarship/price-definitions', icon: <DollarSign className="h-4 w-4" />, label: 'Fiyat Tanımları' },
    { to: '/scholarship/address-labels', icon: <Package className="h-4 w-4" />, label: 'Adres Etiket Baskı' },
    { to: '/scholarship/reports', icon: <BarChart3 className="h-4 w-4" />, label: 'Raporlar' },
    { to: '/scholarship/data-control', icon: <Database className="h-4 w-4" />, label: 'Veri Kontrolü' },
    { to: '/scholarship/module-info', icon: <Info className="h-4 w-4" />, label: 'Modül Bilgilendirme' }
  ]

  const fundSubItems = [
    { to: '/fund/movements', icon: <TrendingUp className="h-4 w-4" />, label: 'Tüm Fon Hareketleri' },
    { to: '/fund/complete-report', icon: <BarChart3 className="h-4 w-4" />, label: 'Tam Fon Raporu' },
    { to: '/fund/regions', icon: <MapPin className="h-4 w-4" />, label: 'Fon Bölgeleri' },
    { to: '/fund/work-areas', icon: <Building className="h-4 w-4" />, label: 'Çalışma Bölgeleri' },
    { to: '/fund/definitions', icon: <Settings className="h-4 w-4" />, label: 'Fon Tanımları' },
    { to: '/fund/activity-definitions', icon: <Activity className="h-4 w-4" />, label: 'Faaliyet Tanımları' },
    { to: '/fund/sources-expenses', icon: <Receipt className="h-4 w-4" />, label: 'Kaynak & Harcama' },
    { to: '/fund/aid-categories', icon: <Layers className="h-4 w-4" />, label: 'Yardım Kategorileri' }
  ]

  const systemSubItems = [
    { to: '/system/user-management', icon: <Users className="h-4 w-4" />, label: 'Kullanıcı Yönetimi' },
    { to: '/system/warning-messages', icon: <AlertTriangle className="h-4 w-4" />, label: 'Uyarı Mesajları' },
    { to: '/system/structural-controls', icon: <Database className="h-4 w-4" />, label: 'Yapısal Kontroller' },
    { to: '/system/local-ips', icon: <Network className="h-4 w-4" />, label: 'Yerel IP Adresleri' },
    { to: '/system/ip-blocking', icon: <Shield className="h-4 w-4" />, label: 'IP Engelleme / Savunma' }
  ]

  const definitionsSubItems = [
    { to: '/definitions/unit-roles', icon: <UserCheck className="h-4 w-4" />, label: 'Birim Rolleri' },
    { to: '/definitions/units', icon: <Building className="h-4 w-4" />, label: 'Birimler' },
    { to: '/definitions/user-accounts', icon: <Users className="h-4 w-4" />, label: 'Kullanıcı Hesapları' },
    { to: '/definitions/permission-groups', icon: <Shield className="h-4 w-4" />, label: 'Yetki Grupları' },
    { to: '/definitions/buildings', icon: <Home className="h-4 w-4" />, label: 'Binalar' },
    { to: '/definitions/internal-lines', icon: <Phone className="h-4 w-4" />, label: 'Sabit Dahili Hatlar' },
    { to: '/definitions/process-flows', icon: <Workflow className="h-4 w-4" />, label: 'Süreç Akışları' },
    { to: '/definitions/passport-formats', icon: <CreditCard className="h-4 w-4" />, label: 'Pasaport Formatları' },
    { to: '/definitions/countries-cities', icon: <Globe className="h-4 w-4" />, label: 'Ülke ve Şehirler' },
    { to: '/definitions/institution-types', icon: <Building2 className="h-4 w-4" />, label: 'Kurum Tür Tanımları' },
    { to: '/definitions/institution-status', icon: <Activity className="h-4 w-4" />, label: 'Kurum Statü Tanımları' },
    { to: '/definitions/donation-methods', icon: <Coins className="h-4 w-4" />, label: 'Bağış Yöntemleri' },
    { to: '/definitions/delivery-types', icon: <Truck className="h-4 w-4" />, label: 'Teslimat Tür Tanımları' },
    { to: '/definitions/meeting-requests', icon: <MessageSquare className="h-4 w-4" />, label: 'Görüşme İstek Tanımları' },
    { to: '/definitions/gsm-codes', icon: <Smartphone className="h-4 w-4" />, label: 'GSM Kod Numaraları' },
    { to: '/definitions/interface-languages', icon: <Languages className="h-4 w-4" />, label: 'Arayüz Dilleri' },
    { to: '/definitions/translations', icon: <Type className="h-4 w-4" />, label: 'Tercüme' },
    { to: '/definitions/general-settings', icon: <Settings className="h-4 w-4" />, label: 'Genel Ayarlar' },
    { to: '/definitions/module-info', icon: <Info className="h-4 w-4" />, label: 'Modül Bilgilendirme' }
  ]

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r corporate-sidebar md:block overflow-y-auto">
      <div className="flex h-16 items-center gap-3 border-b border-white/20 px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">Dernek</span>
            <span className="text-xs text-white/70 -mt-1">Yönetim Sistemi</span>
          </div>
        </Link>
      </div>
      <div className="space-y-6 py-4">
        <div className="px-4">
          <div className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-white/50">Genel Yönetim</div>
          <div className="space-y-1">
            {item('/', <Home className="h-4 w-4" />, 'Dashboard')}
          </div>
        </div>
        <div className="px-4">
          <div className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-white/50">İşbirliği</div>
          <div className="space-y-1">
            {item('/meetings', <Calendar className="h-4 w-4" />, 'Toplantı Yönetimi')}
            {item('/internal-messages', <MessageSquare className="h-4 w-4" />, 'Kurumsal İletişim')}
            {item('/tasks', <CheckSquare className="h-4 w-4" />, 'Görev Koordinasyonu')}
          </div>
        </div>

        <div className="px-4">
          <div className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-white/50">Operasyonel Mod��ller</div>
          <div className="space-y-1">
            {/* Fon Yönetimi - Genişletilebilir */}
            {expandableItem(<Wallet className="h-4 w-4" />, 'Mali İşler Yönetimi', isFundExpanded, () => setIsFundExpanded(!isFundExpanded))}

            {/* Fon Alt menüleri */}
            {isFundExpanded && (
              <div className="space-y-1 mt-1">
                {fundSubItems.map((subItem, index) =>
                  <div key={`fund-sub-${index}`}>
                    {item(subItem.to, subItem.icon, subItem.label, true)}
                  </div>
                )}
              </div>
            )}

            {/* Bağış Yönetimi - Genişletilebilir */}
            {expandableItem(<Coins className="h-4 w-4" />, 'Bağış ve Kaynak Yönetimi', isDonationsExpanded, () => setIsDonationsExpanded(!isDonationsExpanded))}

            {/* Bağış Alt menüleri */}
            {isDonationsExpanded && (
              <div className="space-y-1 mt-1">
                {donationsSubItems.map((subItem, index) =>
                  <div key={`donations-sub-${index}`}>
                    {item(subItem.to, subItem.icon, subItem.label, true)}
                  </div>
                )}
              </div>
            )}
            
            {/* Mesaj Yönetimi - Genişletilebilir */}
            {expandableItem(<Mail className="h-4 w-4" />, 'İletişim Yönetimi', isMessagesExpanded, () => setIsMessagesExpanded(!isMessagesExpanded))}
            
            {/* Mesaj Alt menüleri */}
            {isMessagesExpanded && (
              <div className="space-y-1 mt-1">
                {messagesSubItems.map((subItem, index) => 
                  <div key={`messages-sub-${index}`}>
                    {item(subItem.to, subItem.icon, subItem.label, true)}
                  </div>
                )}
              </div>
            )}
            
            {/* Burs Yönetimi - Genişletilebilir */}
            {expandableItem(<GraduationCap className="h-4 w-4" />, 'Eğitim Desteği Yönetimi', isScholarshipExpanded, () => setIsScholarshipExpanded(!isScholarshipExpanded))}

            {/* Burs Alt menüleri */}
            {isScholarshipExpanded && (
              <div className="space-y-1 mt-1">
                {scholarshipSubItems.map((subItem, index) =>
                  <div key={`scholarship-sub-${index}`}>
                    {item(subItem.to, subItem.icon, subItem.label, true)}
                  </div>
                )}
              </div>
            )}
            
            {/* Yardım Yönetimi - Genişletilebilir */}
            {expandableItem(<HelpingHand className="h-4 w-4" />, 'Yardım Yönetimi', isAidExpanded, () => setIsAidExpanded(!isAidExpanded))}

            {/* Yardım Alt menüleri */}
            {isAidExpanded && (
              <div className="space-y-1 mt-1">
                {aidSubItems.map((subItem, index) =>
                  <div key={`aid-sub-${index}`}>
                    {item(subItem.to, subItem.icon, subItem.label, true)}
                  </div>
                )}
              </div>
            )}

            {/* Tan��mlamalar - Genişletilebilir */}
            {expandableItem(<Settings className="h-4 w-4" />, 'Tanımlamalar', isDefinitionsExpanded, () => setIsDefinitionsExpanded(!isDefinitionsExpanded))}

            {/* Tanımlamalar Alt menüleri */}
            {isDefinitionsExpanded && (
              <div className="space-y-1 mt-1">
                {definitionsSubItems.map((subItem, index) =>
                  <div key={`definitions-sub-${index}`}>
                    {item(subItem.to, subItem.icon, subItem.label, true)}
                  </div>
                )}
              </div>
            )}

            {/* Sistem Yönetimi - Genişletilebilir */}
            {expandableItem(<Shield className="h-4 w-4" />, 'Sistem', isSystemExpanded, () => setIsSystemExpanded(!isSystemExpanded))}

            {/* Sistem Alt menüleri */}
            {isSystemExpanded && (
              <div className="space-y-1 mt-1">
                {systemSubItems.map((subItem, index) =>
                  <div key={`system-sub-${index}`}>
                    {item(subItem.to, subItem.icon, subItem.label, true)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 px-2 text-xs font-semibold uppercase text-white/60">Demo</div>
          <div className="space-y-1">
            {item('/demo/related-records', <FileText className="h-4 w-4" />, 'Bağlantılı Kayıtlar')}
            {item('/supabase-test', <Database className="h-4 w-4" />, 'Supabase Test')}
          </div>
        </div>
      </div>
    </aside>
  )
}
