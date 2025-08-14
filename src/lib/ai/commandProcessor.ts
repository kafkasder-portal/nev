
export type CommandContext = {
  userId?: string
  permissions?: string[]
  currentModule?: string
  selectedData?: any[]
}

export type ProcessedCommand = {
  intent: string
  confidence: number
  parameters: Record<string, any>
  action: string
  module?: string
  operation?: string
  target?: string
  conditions?: Record<string, any>
  metadata?: Record<string, any>
}

export type CommandResult = {
  success: boolean
  message: string
  data?: any
  nextSteps?: string[]
  suggestions?: string[]
}

// Türkçe komut kalıpları ve intent'ler
const COMMAND_PATTERNS = {
  // Veri işlemleri
  CREATE: {
    patterns: [
      /(?:yeni|ekle|oluştur|kaydet|girdi)\s+(.+)/i,
      /(.+)\s+(?:ekle|oluştur|kaydet|girdi)/i,
      /(?:create|add|new)\s+(.+)/i
    ],
    intent: 'CREATE',
    confidence: 0.9
  },
  
  // Listeleme ve arama
  LIST: {
    patterns: [
      /(?:listele|göster|bul|ara|getir)\s+(.+)/i,
      /(.+)\s+(?:listele|göster|bul|ara|getir)/i,
      /(?:list|show|find|search|get)\s+(.+)/i,
      /(?:tümünü|hepsini)\s+(?:göster|listele)/i
    ],
    intent: 'LIST',
    confidence: 0.85
  },
  
  // Güncelleme
  UPDATE: {
    patterns: [
      /(?:güncelle|değiştir|düzenle)\s+(.+)/i,
      /(.+)\s+(?:güncelle|değiştir|düzenle)/i,
      /(?:update|modify|edit|change)\s+(.+)/i
    ],
    intent: 'UPDATE',
    confidence: 0.9
  },
  
  // Silme
  DELETE: {
    patterns: [
      /(?:sil|kaldır|çıkar)\s+(.+)/i,
      /(.+)\s+(?:sil|kaldır|çıkar)/i,
      /(?:delete|remove)\s+(.+)/i
    ],
    intent: 'DELETE',
    confidence: 0.95
  },
  
  // Rapor ve analiz
  REPORT: {
    patterns: [
      /(?:rapor|analiz|istatistik|özet)\s*(?:al|çıkar|oluştur|göster)?\s*(.*)$/i,
      /(.+)\s+(?:raporu|analizi|istatistiği|özeti)/i,
      /(?:report|analysis|stats|summary)\s+(.+)/i
    ],
    intent: 'REPORT',
    confidence: 0.8
  },
  
  // Navigasyon
  NAVIGATE: {
    patterns: [
      /(?:git|aç|geç)\s+(.+)/i,
      /(.+)\s+(?:sayfası|modülü|bölümü)(?:\s+aç)?/i,
      /(?:go to|open|navigate to)\s+(.+)/i
    ],
    intent: 'NAVIGATE',
    confidence: 0.7
  },
  
  // Otomatik işlemler
  AUTOMATE: {
    patterns: [
      /(?:otomatik|toplu|hep birden)\s+(.+)/i,
      /(.+)\s+(?:otomatik|toplu|hep birden)(?:\s+yap)?/i,
      /(?:automate|bulk|batch)\s+(.+)/i
    ],
    intent: 'AUTOMATE',
    confidence: 0.8
  },
  
  // İhracat/İthalat
  EXPORT: {
    patterns: [
      /(?:dışa aktar|export|indir|çıkar)\s+(.+)/i,
      /(.+)\s+(?:dışa aktar|export|indir|çıkar)/i
    ],
    intent: 'EXPORT',
    confidence: 0.9
  },
  
  // Bildirim/Mesaj gönderme
  NOTIFY: {
    patterns: [
      /(?:bildir|gönder|mesaj|sms|email)\s+(.+)/i,
      /(.+)\s+(?:bildir|gönder|mesaj gönder)/i,
      /(?:notify|send|message)\s+(.+)/i
    ],
    intent: 'NOTIFY',
    confidence: 0.85
  }
}

// Modül tanıma kalıpları
const MODULE_PATTERNS = {
  beneficiaries: [
    'hak sahibi', 'haksahibi', 'beneficiary', 'kişi', 'muhtaç', 'yardım alan'
  ],
  donations: [
    'bağış', 'donation', 'para', 'ödeme', 'tahsilat', 'gelir'
  ],
  aid: [
    'yardım', 'aid', 'dağıtım', 'distribution', 'malzeme', 'gıda', 'nakdi'
  ],
  meetings: [
    'toplantı', 'meeting', 'görüşme', 'randevu', 'buluşma'
  ],
  tasks: [
    'görev', 'task', 'yapılacak', 'iş', 'atama', 'assignment'
  ],
  messages: [
    'mesaj', 'message', 'iletişim', 'duyuru', 'bilgilendirme', 'haber'
  ],
  scholarship: [
    'burs', 'scholarship', 'eğitim', 'öğrenci', 'okul', 'üniversite'
  ],
  fund: [
    'fon', 'fund', 'bütçe', 'mali', 'finansal', 'muhasebe'
  ],
  system: [
    'sistem', 'system', 'kullanıcı', 'user', 'yetki', 'permission', 'ayar', 'setting'
  ]
}

// Operasyon türleri
const OPERATION_PATTERNS = {
  add: ['ekle', 'oluştur', 'yeni', 'kaydet', 'add', 'create', 'new', 'save'],
  edit: ['düzenle', 'güncelle', 'değiştir', 'edit', 'update', 'modify', 'change'],
  delete: ['sil', 'kaldır', 'çıkar', 'delete', 'remove'],
  view: ['göster', 'listele', 'bul', 'ara', 'view', 'show', 'list', 'find', 'search'],
  export: ['dışa aktar', 'indir', 'çıkar', 'export', 'download'],
  send: ['gönder', 'bildir', 'ilet', 'send', 'notify'],
  approve: ['onayla', 'kabul et', 'approve', 'accept'],
  reject: ['reddet', 'geri çevir', 'reject', 'decline']
}

export class CommandProcessor {
  private context: CommandContext

  constructor(context: CommandContext = {}) {
    this.context = context
  }

  async processCommand(input: string): Promise<ProcessedCommand> {
    const normalized = this.normalizeInput(input)
    
    // Intent tanıma
    const intentResult = this.detectIntent(normalized)
    
    // Modül tanıma
    const module = this.detectModule(normalized)
    
    // Operasyon tanıma
    const operation = this.detectOperation(normalized)
    
    // Parametre çıkarma
    const parameters = this.extractParameters(normalized, intentResult.intent)
    
    // Hedef belirleme
    const target = this.extractTarget(normalized, module)
    
    // Koşullar
    const conditions = this.extractConditions(normalized)

    return {
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      parameters,
      action: this.mapIntentToAction(intentResult.intent, operation),
      module,
      operation,
      target,
      conditions,
      metadata: {
        originalInput: input,
        normalizedInput: normalized,
        timestamp: new Date().toISOString()
      }
    }
  }

  private normalizeInput(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\-.:]/g, ' ') // Sadece kelime, boşluk, tire, nokta, iki nokta
      .replace(/\s+/g, ' ')
  }

  private detectIntent(input: string): { intent: string; confidence: number } {
    for (const [_intentName, config] of Object.entries(COMMAND_PATTERNS)) {
      for (const pattern of config.patterns) {
        if (pattern.test(input)) {
          return {
            intent: config.intent,
            confidence: config.confidence
          }
        }
      }
    }
    
    return { intent: 'UNKNOWN', confidence: 0 }
  }

  private detectModule(input: string): string | undefined {
    for (const [moduleName, keywords] of Object.entries(MODULE_PATTERNS)) {
      for (const keyword of keywords) {
        if (input.includes(keyword)) {
          return moduleName
        }
      }
    }
    return undefined
  }

  private detectOperation(input: string): string | undefined {
    for (const [operation, keywords] of Object.entries(OPERATION_PATTERNS)) {
      for (const keyword of keywords) {
        if (input.includes(keyword)) {
          return operation
        }
      }
    }
    return undefined
  }

  private extractParameters(input: string, _intent: string): Record<string, any> {
    const params: Record<string, any> = {}
    
    // Sayısal değerler
    const numbers = input.match(/\d+/g)
    if (numbers) {
      params.numbers = numbers.map(n => parseInt(n))
    }
    
    // Tarih kalıpları
    const datePatterns = [
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/g, // dd.mm.yyyy
      /(\d{4})-(\d{1,2})-(\d{1,2})/g,  // yyyy-mm-dd
      /(bugün|today)/gi,
      /(dün|yesterday)/gi,
      /(yarın|tomorrow)/gi,
      /(bu hafta|this week)/gi,
      /(bu ay|this month)/gi
    ]
    
    for (const pattern of datePatterns) {
      const matches = Array.from(input.matchAll(pattern))
      if (matches.length > 0) {
        params.dates = matches.map(m => m[0])
      }
    }
    
    // Kişi adları (büyük harfle başlayan kelimeler)
    const names = input.match(/\b[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+/g)
    if (names) {
      params.names = names
    }
    
    // ID kalıpları
    const ids = input.match(/id\s*[:=]\s*([a-z0-9-]+)/gi)
    if (ids) {
      params.ids = ids.map(id => id.split(/[:=]/)[1].trim())
    }
    
    // Miktar kalıpları
    const amounts = input.match(/(\d+(?:\.\d+)?)\s*(tl|lira|euro|dolar|\$|€)/gi)
    if (amounts) {
      params.amounts = amounts
    }

    return params
  }

  private extractTarget(input: string, module?: string): string | undefined {
    if (!module) return undefined
    
    // Modüle göre hedef belirleme
    const targetPatterns: Record<string, RegExp[]> = {
      beneficiaries: [
        /hak sahibi\s+([a-z\s]+)/i,
        /kişi\s+([a-z\s]+)/i,
        /id\s*[:=]\s*([a-z0-9-]+)/i
      ],
      donations: [
        /bağış\s+([a-z\s]+)/i,
        /ödeme\s+([a-z\s]+)/i
      ],
      // Diğer modüller için benzer kalıplar...
    }
    
    const patterns = targetPatterns[module] || []
    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }
    
    return undefined
  }

  private extractConditions(input: string): Record<string, any> {
    const conditions: Record<string, any> = {}
    
    // Durum koşulları
    if (input.includes('aktif') || input.includes('active')) {
      conditions.status = 'active'
    }
    if (input.includes('pasif') || input.includes('inactive')) {
      conditions.status = 'inactive'
    }
    if (input.includes('beklemede') || input.includes('pending')) {
      conditions.status = 'pending'
    }
    
    // Tarih aralığı koşulları
    if (input.includes('son') && input.includes('gün')) {
      const match = input.match(/son\s+(\d+)\s+gün/i)
      if (match) {
        conditions.lastDays = parseInt(match[1])
      }
    }
    
    // Limit koşulları
    if (input.includes('ilk') || input.includes('first')) {
      const match = input.match(/(?:ilk|first)\s+(\d+)/i)
      if (match) {
        conditions.limit = parseInt(match[1])
      }
    }
    
    return conditions
  }

  private mapIntentToAction(intent: string, operation?: string): string {
    const mapping: Record<string, string> = {
      'CREATE': 'create',
      'LIST': 'list',
      'UPDATE': 'update',
      'DELETE': 'delete',
      'REPORT': 'report',
      'NAVIGATE': 'navigate',
      'AUTOMATE': 'automate',
      'EXPORT': 'export',
      'NOTIFY': 'notify'
    }
    
    return operation || mapping[intent] || 'unknown'
  }

  updateContext(newContext: Partial<CommandContext>) {
    this.context = { ...this.context, ...newContext }
  }
}

// Yardımcı fonksiyonlar
export function createCommandProcessor(context?: CommandContext): CommandProcessor {
  return new CommandProcessor(context)
}

export function getCommandSuggestions(input: string): string[] {
  const suggestions: string[] = []
  
  if (input.length < 3) {
    return [
      'Hak sahibi listele',
      'Yeni bağış ekle',
      'Toplantı oluştur',
      'Rapor al',
      'Mesaj gönder'
    ]
  }
  
  // Input'a göre akıllı öneriler
  const normalized = input.toLowerCase()
  
  if (normalized.includes('hak') || normalized.includes('kişi')) {
    suggestions.push(
      'Hak sahibi listele',
      'Yeni hak sahibi ekle',
      'Hak sahibi ara: ad soyad',
      'Hak sahibi belgesi yükle'
    )
  }
  
  if (normalized.includes('bağış') || normalized.includes('para')) {
    suggestions.push(
      'Bağış listele',
      'Yeni bağış ekle',
      'Bağış raporu al',
      'Bağış dışa aktar'
    )
  }
  
  if (normalized.includes('rapor') || normalized.includes('analiz')) {
    suggestions.push(
      'Aylık rapor al',
      'Bağış analizi yap',
      'Dağıtım raporu oluştur',
      'İstatistik göster'
    )
  }
  
  return suggestions.slice(0, 5)
}
