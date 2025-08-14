import { describe, it, expect } from 'vitest'
import { 
  formatMessage,
  getStatusColor,
  getInitials,
  groupByDate
} from '../collaboration'

describe('collaboration utils', () => {
  describe('formatMessage', () => {
    it('should format message correctly', () => {
      const message = {
        id: '1',
        content: 'Test message',
        sender: 'user1',
        timestamp: new Date('2024-01-01T10:00:00Z'),
        type: 'text'
      }

      const formatted = formatMessage(message)
      expect(formatted).toHaveProperty('id', '1')
      expect(formatted).toHaveProperty('content', 'Test message')
    })
  })

  describe('getStatusColor', () => {
    it('should return correct color for online status', () => {
      const color = getStatusColor('online')
      expect(color).toBe('text-green-500')
    })

    it('should return correct color for offline status', () => {
      const color = getStatusColor('offline')
      expect(color).toBe('text-gray-400')
    })

    it('should return correct color for away status', () => {
      const color = getStatusColor('away')
      expect(color).toBe('text-yellow-500')
    })

    it('should return default color for unknown status', () => {
      const color = getStatusColor('unknown')
      expect(color).toBe('text-gray-400')
    })
  })

  describe('getInitials', () => {
    it('should return initials for full name', () => {
      const initials = getInitials('John Doe')
      expect(initials).toBe('JD')
    })

    it('should return single letter for one name', () => {
      const initials = getInitials('John')
      expect(initials).toBe('J')
    })

    it('should handle empty string', () => {
      const initials = getInitials('')
      expect(initials).toBe('')
    })

    it('should handle multiple spaces', () => {
      const initials = getInitials('John   Doe   Smith')
      expect(initials).toBe('JDS')
    })
  })

  describe('groupByDate', () => {
    it('should group items by date', () => {
      const items = [
        { id: '1', date: new Date('2024-01-01') },
        { id: '2', date: new Date('2024-01-01') },
        { id: '3', date: new Date('2024-01-02') }
      ]

      const grouped = groupByDate(items, 'date')
      expect(Object.keys(grouped)).toHaveLength(2)
      expect(grouped['2024-01-01']).toHaveLength(2)
      expect(grouped['2024-01-02']).toHaveLength(1)
    })

    it('should handle empty array', () => {
      const grouped = groupByDate([], 'date')
      expect(grouped).toEqual({})
    })

    it('should handle items without date property', () => {
      const items = [
        { id: '1', date: new Date('2024-01-01') },
        { id: '2' }
      ]

      const grouped = groupByDate(items, 'date')
      expect(Object.keys(grouped)).toHaveLength(1)
      expect(grouped['2024-01-01']).toHaveLength(1)
    })
  })
})

