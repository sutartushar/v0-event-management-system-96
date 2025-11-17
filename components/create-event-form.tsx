'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function CreateEventForm({ profiles, selectedProfile, onEventCreated, onCancel }) {
  const [selectedProfiles, setSelectedProfiles] = useState(selectedProfile ? [selectedProfile] : [])
  const [timezone, setTimezone] = useState('Eastern Time (ET)')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('09:00')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile')
      return
    }
    if (!startDate || !endDate) {
      setError('Please select start and end dates')
      return
    }

    const startDateTime = new Date(`${startDate}T${startTime}`)
    const endDateTime = new Date(`${endDate}T${endTime}`)

    if (endDateTime <= startDateTime) {
      setError('End date/time must be after start date/time')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileIds: selectedProfiles,
          timezone,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          startTime,
          endTime
        })
      })

      if (res.ok) {
        const newEvent = await res.json()
        onEventCreated(newEvent)
        // Reset form
        setSelectedProfiles(selectedProfile ? [selectedProfile] : [])
        setTimezone('Eastern Time (ET)')
        setStartDate('')
        setStartTime('09:00')
        setEndDate('')
        setEndTime('09:00')
      } else {
        setError('Failed to create event')
      }
    } catch (err) {
      setError('Error creating event: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Profiles Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Profiles</label>
        <div className="border border-border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto bg-background">
          {profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No profiles available</p>
          ) : (
            profiles.map(profile => (
              <label key={profile.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProfiles.includes(profile.id)}
                  onChange={() => handleProfileToggle(profile.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">{profile.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Timezone */}
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

      {/* Start Date & Time */}
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

      {/* End Date & Time */}
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

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </Button>
    </form>
  )
}
