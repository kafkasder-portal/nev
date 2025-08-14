export type NLPResult = {
  intent: string
  entities: Record<string, any>
  confidence: number
  processedText: string
  suggestions?: string[]
}

export type Entity = {
  type: 'PERSON' | 'DATE' | 'NUMBER' | 'MONEY' | 'PHONE' | 'EMAIL' | 'ID' | 'LOCATION' | 'STATUS'
  value: string
  normalized?: any
  confidence: number
  start: number
  end: number
}

export class TurkishNLPProcessor {
  private turkishStopWords = [
    've', 'bir', 'bu', 'da', 'de', 'den', 'ile', 'için', 'gibi', 'kadar', 'sonra', 
    'önce', 'üzere', 'diye', 'beri', 'ama', 'fakat', 'ancak', 'lakin', 'çünkü',
    'ise', 'eğer', 'ki', 'ya', 'yahut', 'veya', 'hem', 'ne', 'hangi', 'nasıl',
    'nerede', 'ne zaman', 'niye', 'niçin', 'kim', 'kimin', 'kime', 'kimi'
  ]

  private turkishSynonyms: Record<string, string[]> = {
    'ekle': ['oluştur', 'yap', 'kaydet', 'gir', 'add', 'create', 'save'],
    'göster': ['listele', 'bul', 'ara', 'getir', 'show', 'list', 'find', 'search'],
    'güncelle': ['değiştir', 'düzenle', 'revize et', 'update', 'edit', 'modify'],
    'sil': ['kaldır', 'çıkar', 'iptal et', 'delete', 'remove', 'cancel'],
    'gönder': ['ilet', 'yolla', 'bildir', 'send', 'notify', 'deliver'],
    'rapor': ['analiz', 'özet', 'istatistik', 'report', 'analysis', 'summary'],
    'hak sahibi': ['muhtaç', 'yardım alan', 'beneficiary', 'kişi', 'birey'],
    'bağış': ['donation', 'para', 'ödeme', 'tahsilat', 'gelir', 'money'],
    'toplantı': ['meeting', 'görüşme', 'randevu', 'buluşma', 'conference'],
    'görev': ['task', 'iş', 'atama', 'assignment', 'work', 'job'],
    'mesaj': ['message', 'bilgi', 'duyuru', 'haber', 'text', 'notification']
  }

  private patterns = {
    // Tarih kalıpları
    date: [
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/g, // 15.03.2024
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/g, // 15/03/2024
      /(\d{4})-(\d{1,2})-(\d{1,2})/g,  // 2024-03-15
      /(bugün|today)/gi,
      /(dün|yesterday)/gi,
      /(yarın|tomorrow)/gi,
      /(geçen hafta|last week)/gi,
      /(bu hafta|this week)/gi,
      /(gelecek hafta|next week)/gi,
      /(geçen ay|last month)/gi,
      /(bu ay|this month)/gi,
      /(gelecek ay|next month)/gi,
      /(son \d+ gün)/gi,
      /(son \d+ hafta)/gi,
      /(son \d+ ay)/gi
    ],

    // Kişi adları (Türkçe karakterlerle)
    person: [
      /\b[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+(?:\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+)?\b/g
    ],

    // Para miktarları
    money: [
      /(\d+(?:[.,]\d+)?)\s*(?:tl|lira|₺)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:euro|eur|€)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:dolar|dollar|usd|\$)/gi,
      /(\d+(?:[.,]\d+)?)\s*(?:pound|gbp|£)/gi
    ],

    // Telefon numaraları
    phone: [
      /(\+90\s?)?(\d{3})\s?(\d{3})\s?(\d{2})\s?(\d{2})/g,
      /(\d{11})/g
    ],

    // Email adresleri
    email: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    ],

    // ID kalıpları
    id: [
      /id\s*[:=]\s*([a-z0-9-]+)/gi,
      /kimlik\s*[:=]\s*([a-z0-9-]+)/gi,
      /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi
    ],

    // Sayılar
    number: [
      /\b\d+\b/g
    ],

    // Durum kalıpları
    status: [
      /\b(aktif|active|pasif|inactive|beklemede|pending|tamamlandı|completed|iptal|cancelled)\b/gi
    ],

    // Konum kalıpları
    location: [
      /\b[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+(?:\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+)*(?:\s+(?:ili|ilçesi|mahallesi|caddesi|sokağı))\b/g
    ]
  }

  async processText(text: string): Promise<NLPResult> {
    const processedText = this.normalizeText(text)
    const entities = this.extractEntities(text)
    const intent = this.detectIntent(processedText, entities)
    const confidence = this.calculateConfidence(intent, entities)
    const suggestions = this.generateSuggestions(processedText, intent, entities)

    return {
      intent,
      entities: this.groupEntities(entities),
      confidence,
      processedText,
      suggestions
    }
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      // Türkçe karakter normalizasyonu
      .replace(/i̇/g, 'i')
      .replace(/İ/g, 'i')
      // Noktalama işaretlerini temizle
      .replace(/[^\w\sçğıiöşüÇĞIİÖŞÜ\-.:]/g, ' ')
      // Çoklu boşlukları tek boşluğa çevir
      .replace(/\s+/g, ' ')
  }

  private extractEntities(text: string): Entity[] {
    const entities: Entity[] = []

    // Her pattern türü için entity çıkarma
    Object.entries(this.patterns).forEach(([type, patterns]) => {
      patterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(text)) !== null) {
          const entity: Entity = {
            type: type.toUpperCase() as any,
            value: match[0],
            confidence: this.getEntityConfidence(type, match[0]),
            start: match.index,
            end: match.index + match[0].length
          }

          // Normalizasyon
          entity.normalized = this.normalizeEntity(entity)
          entities.push(entity)
        }
      })
    })

    // Çakışan entity'leri temizle (daha yüksek confidence olan kazanır)
    return this.resolveEntityConflicts(entities)
  }

  private normalizeEntity(entity: Entity): any {
    switch (entity.type) {
      case 'DATE':
        return this.normalizeDate(entity.value)
      case 'MONEY':
        return this.normalizeMoney(entity.value)
      case 'PHONE':
        return this.normalizePhone(entity.value)
      case 'PERSON':
        return this.normalizePerson(entity.value)
      case 'NUMBER':
        return parseInt(entity.value.replace(/\D/g, '')) || 0
      case 'STATUS':
        return this.normalizeStatus(entity.value)
      default:
        return entity.value
    }
  }

  private normalizeDate(dateStr: string): Date | string {
    const lowerDate = dateStr.toLowerCase()
    const now = new Date()

    // Türkçe tarih ifadeleri
    if (lowerDate.includes('bugün') || lowerDate.includes('today')) {
      return now
    }
    if (lowerDate.includes('dün') || lowerDate.includes('yesterday')) {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    }
    if (lowerDate.includes('yarın') || lowerDate.includes('tomorrow')) {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow
    }

    // Son X gün kalıbı
    const lastDaysMatch = lowerDate.match(/son (\d+) gün/)
    if (lastDaysMatch) {
      const days = parseInt(lastDaysMatch[1])
      const date = new Date(now)
      date.setDate(date.getDate() - days)
      return date
    }

    // Standart tarih formatları
    const dateFormats = [
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{4})-(\d{1,2})-(\d{1,2})/
    ]

    for (const format of dateFormats) {
      const match = dateStr.match(format)
      if (match) {
        let [, day, month, year] = match
        if (format.source.startsWith('(\\d{4})')) {
          // YYYY-MM-DD formatı
          [, year, month, day] = match
        }
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }
    }

    return dateStr
  }

  private normalizeMoney(moneyStr: string): { amount: number; currency: string } {
    const amount = parseFloat(moneyStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
    let currency = 'TRY'

    if (/euro|eur|€/i.test(moneyStr)) currency = 'EUR'
    else if (/dolar|dollar|usd|\$/i.test(moneyStr)) currency = 'USD'
    else if (/pound|gbp|£/i.test(moneyStr)) currency = 'GBP'

    return { amount, currency }
  }

  private normalizePhone(phoneStr: string): string {
    const digits = phoneStr.replace(/\D/g, '')
    if (digits.length === 11 && digits.startsWith('0')) {
      return '+90' + digits.substring(1)
    }
    if (digits.length === 10) {
      return '+90' + digits
    }
    return phoneStr
  }

  private normalizePerson(personStr: string): { firstName: string; lastName: string; fullName: string } {
    const parts = personStr.trim().split(/\s+/)
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      fullName: personStr.trim()
    }
  }

  private normalizeStatus(statusStr: string): string {
    const lowerStatus = statusStr.toLowerCase()
    if (['aktif', 'active'].includes(lowerStatus)) return 'active'
    if (['pasif', 'inactive'].includes(lowerStatus)) return 'inactive'
    if (['beklemede', 'pending'].includes(lowerStatus)) return 'pending'
    if (['tamamlandı', 'completed'].includes(lowerStatus)) return 'completed'
    if (['iptal', 'cancelled'].includes(lowerStatus)) return 'cancelled'
    return statusStr
  }

  private detectIntent(text: string, entities: Entity[]): string {
    const words = text.split(/\s+/)
    
    // Intent skorları
    const intentScores: Record<string, number> = {
      CREATE: 0,
      READ: 0,
      UPDATE: 0,
      DELETE: 0,
      SEARCH: 0,
      REPORT: 0,
      NAVIGATE: 0,
      EXPORT: 0,
      NOTIFY: 0
    }

    // Kelime bazlı intent puanlama
    words.forEach(word => {
      // CREATE intent
      if (['ekle', 'oluştur', 'yap', 'kaydet', 'gir', 'add', 'create', 'save', 'new', 'yeni'].includes(word)) {
        intentScores.CREATE += 2
      }

      // READ/SEARCH intent
      if (['göster', 'listele', 'bul', 'ara', 'getir', 'show', 'list', 'find', 'search', 'get'].includes(word)) {
        intentScores.READ += 2
        intentScores.SEARCH += 1.5
      }

      // UPDATE intent
      if (['güncelle', 'değiştir', 'düzenle', 'revize', 'update', 'edit', 'modify', 'change'].includes(word)) {
        intentScores.UPDATE += 2
      }

      // DELETE intent
      if (['sil', 'kaldır', 'çıkar', 'iptal', 'delete', 'remove', 'cancel'].includes(word)) {
        intentScores.DELETE += 2
      }

      // REPORT intent
      if (['rapor', 'analiz', 'özet', 'istatistik', 'report', 'analysis', 'summary', 'stats'].includes(word)) {
        intentScores.REPORT += 2
      }

      // NAVIGATE intent
      if (['git', 'aç', 'geç', 'go', 'open', 'navigate'].includes(word)) {
        intentScores.NAVIGATE += 1.5
      }

      // EXPORT intent
      if (['dışa', 'aktar', 'indir', 'çıkar', 'export', 'download'].includes(word)) {
        intentScores.EXPORT += 2
      }

      // NOTIFY intent
      if (['gönder', 'bildir', 'ilet', 'send', 'notify', 'mesaj'].includes(word)) {
        intentScores.NOTIFY += 2
      }
    })

    // Entity bazlı intent güçlendirme
    entities.forEach(entity => {
      if (entity.type === 'PERSON') {
        intentScores.SEARCH += 0.5
        intentScores.UPDATE += 0.5
      }
      if (entity.type === 'DATE') {
        intentScores.REPORT += 0.5
        intentScores.SEARCH += 0.5
      }
      if (entity.type === 'MONEY') {
        intentScores.CREATE += 0.5 // Bağış ekleme
        intentScores.REPORT += 0.5
      }
    })

    // En yüksek skoru olan intent'i döndür
    const maxScore = Math.max(...Object.values(intentScores))
    const detectedIntent = Object.keys(intentScores).find(
      key => intentScores[key] === maxScore
    )

    return detectedIntent || 'UNKNOWN'
  }

  private calculateConfidence(intent: string, entities: Entity[]): number {
    let confidence = 0.3 // Base confidence

    // Intent'e göre confidence artırma
    if (intent !== 'UNKNOWN') confidence += 0.3

    // Entity sayısına göre confidence artırma
    confidence += Math.min(entities.length * 0.1, 0.3)

    // Yüksek confidence entity'lere göre artırma
    const highConfidenceEntities = entities.filter(e => e.confidence > 0.8)
    confidence += highConfidenceEntities.length * 0.1

    return Math.min(confidence, 1.0)
  }

  private generateSuggestions(_text: string, intent: string, entities: Entity[]): string[] {
    const suggestions: string[] = []

    // Intent bazlı öneriler
    if (intent === 'CREATE') {
      suggestions.push('Hangi modülde oluşturmak istiyorsunuz?')
      if (!entities.some(e => e.type === 'PERSON')) {
        suggestions.push('Kişi adı belirtir misiniz?')
      }
    }

    if (intent === 'SEARCH') {
      suggestions.push('Aramayı hangi kriterlere göre yapalım?')
      suggestions.push('Tarih aralığı belirtmek ister misiniz?')
    }

    if (intent === 'REPORT') {
      suggestions.push('Hangi tarih aralı��ı için rapor?')
      suggestions.push('Hangi modül raporu: bağış, hak sahibi, görev?')
    }

    // Entity eksikliği durumunda öneriler
    if (entities.length === 0) {
      suggestions.push('Daha spesifik bilgi verebilir misiniz?')
      suggestions.push('Hangi modülle ilgili: bağış, hak sahibi, toplantı?')
    }

    return suggestions.slice(0, 3) // Maksimum 3 öneri
  }

  private groupEntities(entities: Entity[]): Record<string, any> {
    const grouped: Record<string, any> = {}

    entities.forEach(entity => {
      const key = entity.type.toLowerCase()
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push({
        value: entity.value,
        normalized: entity.normalized,
        confidence: entity.confidence
      })
    })

    // Tekil değerler için array'den çıkar
    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 1) {
        grouped[key] = grouped[key][0]
      }
    })

    return grouped
  }

  private resolveEntityConflicts(entities: Entity[]): Entity[] {
    // Pozisyona göre sırala
    entities.sort((a, b) => a.start - b.start)

    const resolved: Entity[] = []
    
    for (const entity of entities) {
      // Çakışma kontrolü
      const hasConflict = resolved.some(existing => 
        (entity.start >= existing.start && entity.start < existing.end) ||
        (entity.end > existing.start && entity.end <= existing.end)
      )

      if (!hasConflict) {
        resolved.push(entity)
      } else {
        // Çakışma varsa, daha yüksek confidence olan kazanır
        const conflictingIndex = resolved.findIndex(existing =>
          (entity.start >= existing.start && entity.start < existing.end) ||
          (entity.end > existing.start && entity.end <= existing.end)
        )

        if (conflictingIndex !== -1 && entity.confidence > resolved[conflictingIndex].confidence) {
          resolved[conflictingIndex] = entity
        }
      }
    }

    return resolved
  }

  private getEntityConfidence(type: string, value: string): number {
    // Entity türüne göre confidence hesaplama
    switch (type) {
      case 'email':
        return /@.+\..+/.test(value) ? 0.95 : 0.6
      case 'phone':
        return /\+90\s?\d{10}/.test(value) ? 0.9 : 0.7
      case 'id':
        return /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/.test(value) ? 0.95 : 0.8
      case 'money':
        return /\d+[.,]\d+/.test(value) ? 0.9 : 0.8
      case 'date':
        return /\d{1,2}[.\/]\d{1,2}[.\/]\d{4}/.test(value) ? 0.9 : 0.7
      case 'person':
        return /^[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]+$/.test(value) ? 0.8 : 0.6
      default:
        return 0.7
    }
  }

  // Synonym expansion için
  expandWithSynonyms(text: string): string {
    let expandedText = text

    Object.entries(this.turkishSynonyms).forEach(([main, synonyms]) => {
      synonyms.forEach(synonym => {
        const regex = new RegExp(`\\b${synonym}\\b`, 'gi')
        expandedText = expandedText.replace(regex, main)
      })
    })

    return expandedText
  }

  // Stop words temizleme
  removeStopWords(text: string): string {
    const words = text.split(/\s+/)
    const filteredWords = words.filter(word => 
      !this.turkishStopWords.includes(word.toLowerCase())
    )
    return filteredWords.join(' ')
  }
}

// Singleton instance
export const nlpProcessor = new TurkishNLPProcessor()
