import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (replace with database in production)
let events = [
  {
    id: '1',
    profileIds: ['1'],
    title: 'Team Meeting',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 90000000).toISOString(),
    timezone: 'Eastern Time (ET)',
    startTime: '09:00',
    endTime: '10:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let nextEventId = 2

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get('profileId')

  if (!profileId) {
    return NextResponse.json(events)
  }

  const filteredEvents = events.filter(e => e.profileIds.includes(profileId))
  return NextResponse.json(filteredEvents)
}

export async function POST(request: NextRequest) {
  const { profileIds, timezone, startDate, endDate, startTime, endTime } = await request.json()

  if (!profileIds || profileIds.length === 0) {
    return NextResponse.json(
      { error: 'At least one profile is required' },
      { status: 400 }
    )
  }

  const startDateTime = new Date(startDate)
  const endDateTime = new Date(endDate)

  if (endDateTime <= startDateTime) {
    return NextResponse.json(
      { error: 'End date/time must be after start date/time' },
      { status: 400 }
    )
  }

  const newEvent = {
    id: String(nextEventId++),
    profileIds,
    title: 'New Event',
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    timezone,
    startTime,
    endTime,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  events.push(newEvent)
  return NextResponse.json(newEvent)
}
