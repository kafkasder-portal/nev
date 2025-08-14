import { describe, it, expect, vi, beforeEach } from 'vitest'
import { meetingsApi } from '../meetings'
import { mockMeeting } from '../../test/utils'

// Mock the API client
vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('meetingsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMeetings', () => {
    it('should fetch meetings successfully', async () => {
      const mockResponse = {
        data: [mockMeeting],
        error: null
      }

      const { apiClient } = await import('../client')
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await meetingsApi.getMeetings()

      expect(apiClient.get).toHaveBeenCalledWith('/meetings')
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const mockError = new Error('API Error')
      const { apiClient } = await import('../client')
      vi.mocked(apiClient.get).mockRejectedValue(mockError)

      await expect(meetingsApi.getMeetings()).rejects.toThrow('API Error')
    })
  })

  describe('getMeeting', () => {
    it('should fetch a single meeting successfully', async () => {
      const mockResponse = {
        data: mockMeeting,
        error: null
      }

      const { apiClient } = await import('../client')
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await meetingsApi.getMeeting('1')

      expect(apiClient.get).toHaveBeenCalledWith('/meetings/1')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createMeeting', () => {
    it('should create a meeting successfully', async () => {
      const newMeeting = {
        title: 'Test Meeting',
        description: 'Test Description',
        start_date: '2024-01-01T10:00:00Z',
        end_date: '2024-01-01T11:00:00Z',
        meeting_type: 'physical' as const,
        location: 'Test Location'
      }

      const mockResponse = {
        data: { ...mockMeeting, ...newMeeting },
        error: null
      }

      const { apiClient } = await import('../client')
      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await meetingsApi.createMeeting(newMeeting)

      expect(apiClient.post).toHaveBeenCalledWith('/meetings', newMeeting)
      expect(result).toEqual(mockResponse)
    })

    it('should handle creation errors', async () => {
      const newMeeting = {
        title: 'Test Meeting',
        description: 'Test Description',
        start_date: '2024-01-01T10:00:00Z',
        end_date: '2024-01-01T11:00:00Z',
        meeting_type: 'physical' as const,
        location: 'Test Location'
      }

      const { apiClient } = await import('../client')
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Creation failed'))

      await expect(meetingsApi.createMeeting(newMeeting)).rejects.toThrow('Creation failed')
    })
  })

  describe('updateMeeting', () => {
    it('should update a meeting successfully', async () => {
      const updateData = {
        title: 'Updated Meeting',
        description: 'Updated Description'
      }

      const mockResponse = {
        data: { ...mockMeeting, ...updateData },
        error: null
      }

      const { apiClient } = await import('../client')
      vi.mocked(apiClient.put).mockResolvedValue(mockResponse)

      const result = await meetingsApi.updateMeeting('1', updateData)

      expect(apiClient.put).toHaveBeenCalledWith('/meetings/1', updateData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteMeeting', () => {
    it('should delete a meeting successfully', async () => {
      const mockResponse = {
        data: null,
        error: null
      }

      const { apiClient } = await import('../client')
      vi.mocked(apiClient.delete).mockResolvedValue(mockResponse)

      const result = await meetingsApi.deleteMeeting('1')

      expect(apiClient.delete).toHaveBeenCalledWith('/meetings/1')
      expect(result).toEqual(mockResponse)
    })
  })
})
