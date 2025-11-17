'use client'

import { useState, useEffect } from 'react'
import CreateEventForm from '@/components/create-event-form'
import EventsList from '@/components/events-list'
import ProfileSelector from '@/components/profile-selector'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Home() {
  const [profiles, setProfiles] = useState([])
  const [events, setEvents] = useState([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [timezone, setTimezone] = useState('Eastern Time (ET)')
  const [loading, setLoading] = useState(true)

  // Fetch profiles on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/profiles')
        const data = await res.json()
        setProfiles(data)
        if (data.length > 0) {
          setSelectedProfile(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching profiles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  // Fetch events when selected profile changes
  useEffect(() => {
    if (selectedProfile) {
      const fetchEvents = async () => {
        try {
          const res = await fetch(`/api/events?profileId=${selectedProfile}`)
          const data = await res.json()
          setEvents(data)
        } catch (error) {
          console.error('Error fetching events:', error)
        }
      }
      fetchEvents()
    }
  }, [selectedProfile])

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, newEvent])
    setShowCreateForm(false)
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
      setEvents(events.filter(e => e.id !== eventId))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Event Management</h1>
            <ProfileSelector
              profiles={profiles}
              selectedProfile={selectedProfile}
              onSelectProfile={setSelectedProfile}
              onAddProfile={async (name) => {
                const res = await fetch('/api/profiles', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name })
                })
                const newProfile = await res.json()
                setProfiles([...profiles, newProfile])
                setSelectedProfile(newProfile.id)
              }}
            />
          </div>
          <p className="text-muted-foreground">Create and manage events across multiple timezones</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Event Section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Create Event</h2>
              {!showCreateForm ? (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              ) : (
                <>
                  <CreateEventForm
                    profiles={profiles}
                    selectedProfile={selectedProfile}
                    onEventCreated={handleCreateEvent}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </>
              )}
            </div>
          </div>

          {/* Events List Section */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-4">Events</h2>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3">View in Timezone</p>
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
            <EventsList
              events={events}
              timezone={timezone}
              selectedProfile={selectedProfile}
              profiles={profiles}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
