import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { formatDistanceToNow, format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface TimeTrackerProps {
  taskId: string
  estimatedHours?: number
  trackedTime?: number // in seconds
  onTimeUpdate?: (timeInSeconds: number) => void
  disabled?: boolean
}

interface TimeSession {
  start: Date
  end?: Date
  duration: number // in seconds
}

export default function TimeTracker({ 
  taskId, 
  estimatedHours, 
  trackedTime = 0, 
  onTimeUpdate,
  disabled = false 
}: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentTime, setCurrentTime] = useState(trackedTime)
  const [sessionStart, setSessionStart] = useState<Date | null>(null)
  const [sessions, setSessions] = useState<TimeSession[]>([])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking && sessionStart) {
      interval = setInterval(() => {
        const now = new Date()
        const sessionDuration = Math.floor((now.getTime() - sessionStart.getTime()) / 1000)
        setCurrentTime(trackedTime + sessionDuration)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isTracking, sessionStart, trackedTime])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (disabled) return
    
    setIsTracking(true)
    setSessionStart(new Date())
  }

  const handlePause = () => {
    if (!sessionStart) return
    
    const now = new Date()
    const sessionDuration = Math.floor((now.getTime() - sessionStart.getTime()) / 1000)
    
    const newSession: TimeSession = {
      start: sessionStart,
      end: now,
      duration: sessionDuration
    }
    
    setSessions(prev => [...prev, newSession])
    setIsTracking(false)
    setSessionStart(null)
    
    const newTotalTime = trackedTime + sessionDuration
    onTimeUpdate?.(newTotalTime)
  }

  const handleStop = () => {
    if (isTracking) {
      handlePause()
    }
    
    // Save to localStorage for persistence
    localStorage.setItem(`task-${taskId}-time`, currentTime.toString())
  }

  const handleReset = () => {
    if (disabled) return
    
    setIsTracking(false)
    setSessionStart(null)
    setCurrentTime(0)
    setSessions([])
    onTimeUpdate?.(0)
    localStorage.removeItem(`task-${taskId}-time`)
  }

  const getTimeStatus = () => {
    if (!estimatedHours) return null
    
    const estimatedSeconds = estimatedHours * 3600
    const percentage = (currentTime / estimatedSeconds) * 100
    
    if (percentage <= 100) {
      return { color: 'green', status: 'İyi durumda' }
    } else if (percentage <= 120) {
      return { color: 'yellow', status: 'Süre aşılıyor' }
    } else {
      return { color: 'red', status: 'Süre aşıldı' }
    }
  }

  const timeStatus = getTimeStatus()

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Zaman Takibi</span>
          </div>
          {timeStatus && (
            <Badge variant={timeStatus.color === 'green' ? 'default' : 'destructive'}>
              {timeStatus.status}
            </Badge>
          )}
        </div>

        {/* Time Display */}
        <div className="text-center">
          <div className="text-3xl font-mono font-bold">
            {formatTime(currentTime)}
          </div>
          {estimatedHours && (
            <div className="text-sm text-muted-foreground">
              Tahmini: {estimatedHours}h ({formatTime(estimatedHours * 3600)})
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-2">
          {!isTracking ? (
            <Button 
              onClick={handleStart} 
              disabled={disabled}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-1" />
              Başlat
            </Button>
          ) : (
            <Button 
              onClick={handlePause}
              size="sm"
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-1" />
              Duraklat
            </Button>
          )}
          
          <Button 
            onClick={handleStop}
            size="sm"
            variant="outline"
            disabled={disabled}
          >
            <Square className="h-4 w-4 mr-1" />
            Durdur
          </Button>
          
          <Button 
            onClick={handleReset}
            size="sm"
            variant="outline"
            disabled={disabled}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Sıfırla
          </Button>
        </div>

        {/* Sessions List */}
        {sessions.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Çalışma Seansları</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {sessions.map((session, index) => (
                <div key={index} className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {format(session.start, 'HH:mm', { locale: tr })} - {session.end && format(session.end, 'HH:mm', { locale: tr })}
                  </span>
                  <span>{formatTime(session.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
