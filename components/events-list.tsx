'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import EditEventModal from './edit-event-modal'

export default function EventsList({ events, timezone, selectedProfile, profiles, onDeleteEvent }) {
  const [editingEvent, setEditingEvent] = useState(null)

  const formatTime = (date, tz) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: getTimeZoneString(tz)
    }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  const getTimeZoneString = (tz) => {
    const tzMap = {
      'Eastern Time (ET)': 'America/New_York',
      'Central Time (CT)': 'America/Chicago',
      'Mountain Time (MT)': 'America/Denver',
      'Pacific Time (PT)': 'America/Los_Angeles',
      'UTC': 'UTC',
      'GMT+1': 'Europe/London',
      'IST (India)': 'Asia/Kolkata',
      'JST (Japan)': 'Asia/Tokyo',
      'AEST (Australia)': 'Australia/Sydney'
    }
    return tzMap[tz] || 'UTC'
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <div
          key={event.id}
          className="border border-border rounded-md p-4 bg-background hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                {formatTime(event.startDate, timezone)} - {formatTime(event.endDate, timezone)}
              </p>
              <p className="text-sm text-foreground font-medium">
                {event.title || 'Untitled Event'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Timezone: {event.timezone}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingEvent(event)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeleteEvent(event.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={(updatedEvent) => {
            // Update events list
            setEditingEvent(null)
          }}
        />
      )}
    </div>
  )
}
