import { NextRequest, NextResponse } from 'next/server'

// This would be imported from the main route in a real app
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { startDate, endDate, timezone } = await request.json()

  const eventIndex = events.findIndex(e => e.id === id)
  if (eventIndex === -1) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
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

  events[eventIndex] = {
    ...events[eventIndex],
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    timezone,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(events[eventIndex])
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  events = events.filter(e => e.id !== id)
  return NextResponse.json({ success: true })
}
