'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function EditEventModal({ event, onClose, onUpdate }) {
  const [startDate, setStartDate] = useState(event.startDate?.split('T')[0] || '')
  const [startTime, setStartTime] = useState(event.startTime || '09:00')
  const [endDate, setEndDate] = useState(event.endDate?.split('T')[0] || '')
  const [endTime, setEndTime] = useState(event.endTime || '09:00')
  const [timezone, setTimezone] = useState(event.timezone || 'Eastern Time (ET)')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const startDateTime = new Date(`${startDate}T${startTime}`)
    const endDateTime = new Date(`${endDate}T${endTime}`)

    if (endDateTime <= startDateTime) {
      setError('End date/time must be after start date/time')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          timezone
        })
      })

      if (res.ok) {
        const updatedEvent = await res.json()
        onUpdate(updatedEvent)
      } else {
        setError('Failed to update event')
      }
    } catch (err) {
      setError('Error updating event: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Edit Event</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
              <option>Mountain Time (MT)</option>
              <option>Pacific Time (PT)</option>
              <option>UTC</option>
              <option>GMT+1</option>
              <option>IST (India)</option>
              <option>JST (Japan)</option>
              <option>AEST (Australia)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Start Date & Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-24 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">End Date & Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-24 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
