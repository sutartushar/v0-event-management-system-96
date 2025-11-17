import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (replace with database in production)
let profiles = [
  { id: '1', name: 'Alice Johnson', timezone: 'Eastern Time (ET)' },
  { id: '2', name: 'Bob Smith', timezone: 'Pacific Time (PT)' },
]

let nextId = 3

export async function GET() {
  return NextResponse.json(profiles)
}

export async function POST(request: NextRequest) {
  const { name } = await request.json()

  if (!name || name.trim() === '') {
    return NextResponse.json(
      { error: 'Profile name is required' },
      { status: 400 }
    )
  }

  const newProfile = {
    id: String(nextId++),
    name: name.trim(),
    timezone: 'Eastern Time (ET)',
  }

  profiles.push(newProfile)
  return NextResponse.json(newProfile)
}
