'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Plus } from 'lucide-react'

export default function ProfileSelector({ profiles, selectedProfile, onSelectProfile, onAddProfile }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAddingProfile, setIsAddingProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

  const selectedProfileObj = profiles.find(p => p.id === selectedProfile)

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      await onAddProfile(newProfileName)
      setNewProfileName('')
      setIsAddingProfile(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted text-foreground text-sm"
      >
        <span>Select current profile...</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
            {profiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => {
                  onSelectProfile(profile.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedProfile === profile.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                {profile.name}
              </button>
            ))}

            {isAddingProfile ? (
              <div className="px-3 py-2 border-t border-border pt-3">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Profile name..."
                  className="w-full px-2 py-1 border border-border rounded-md bg-background text-foreground text-sm mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddProfile}
                    className="flex-1 bg-primary hover:bg-primary/90 text-sm"
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingProfile(false)
                      setNewProfileName('')
                    }}
                    className="flex-1 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingProfile(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground text-sm border-t border-border mt-2 pt-3"
              >
                <Plus className="w-4 h-4" />
                Add Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
