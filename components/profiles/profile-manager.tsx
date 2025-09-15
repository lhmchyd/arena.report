"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  User,
  UserCircle,
  Crown,
  Shield,
  Star,
  Zap,
  Target,
  Trophy,
  Gamepad2,
  Sword,
  Crosshair,
  Skull,
  Heart,
  Diamond,
  Flame,
  Rocket,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Profile {
  id: string
  name: string
  icon: string
  createdAt: string
  keys: any[]
  armors: any[]
}

const PROFILE_ICONS = [
  "User",
  "UserCircle",
  "Crown",
  "Shield",
  "Star",
  "Zap",
  "Target",
  "Trophy",
  "Gamepad2",
  "Sword",
  "Crosshair",
  "Skull",
  "Heart",
  "Diamond",
  "Flame",
  "Rocket",
]

export default function ProfileManager({ 
  profiles, 
  setProfiles,
  currentProfileId,
  setCurrentProfileId
}: { 
  profiles: Profile[]
  setProfiles: (profiles: Profile[]) => void
  currentProfileId: string
  setCurrentProfileId: (id: string) => void
}) {
  const [isCreateProfileDialogOpen, setIsCreateProfileDialogOpen] = useState(false)
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)
  const [newProfile, setNewProfile] = useState({ name: "", icon: "User" })
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      User,
      UserCircle: () => (
        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-xs">U</div>
      ),
      Crown,
      Shield,
      Star,
      Zap,
      Target,
      Trophy,
      Gamepad2: () => <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center text-xs">G</div>,
      Sword: () => <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center text-xs">S</div>,
      Crosshair,
      Skull,
      Heart,
      Diamond,
      Flame,
      Rocket,
    }

    const IconComponent = iconMap[iconName] || User
    return <IconComponent className="h-4 w-4" />
  }

  const createProfile = () => {
    const profile: Profile = {
      id: Date.now().toString(),
      name: newProfile.name,
      icon: newProfile.icon,
      createdAt: new Date().toISOString(),
      keys: [],
      armors: [],
    }
    setProfiles([...profiles, profile])
    setNewProfile({ name: "", icon: "User" })
    setIsCreateProfileDialogOpen(false)
  }

  const updateProfile = () => {
    if (!editingProfile) return
    setProfiles(
      profiles.map((profile) => (profile.id === editingProfile.id ? editingProfile : profile)),
    )
    setIsEditProfileDialogOpen(false)
    setEditingProfile(null)
  }

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return // Don't delete the last profile

    const newProfiles = profiles.filter((p) => p.id !== profileId)
    setProfiles(newProfiles)

    if (currentProfileId === profileId) {
      const newCurrentProfile = newProfiles[0]
      setCurrentProfileId(newCurrentProfile.id)
    }
  }

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      setCurrentProfileId(profileId)
    }
  }

  const getCurrentProfile = () => {
    return profiles.find((p) => p.id === currentProfileId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Management</h2>
        <p className="text-muted-foreground">Manage your profiles and switch between different key sets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your key tracking data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">Download your key data as JSON</p>
            </div>
            <Button variant="outline">Export</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Clear All Data</p>
              <p className="text-sm text-muted-foreground">Remove all keys and run history</p>
            </div>
            <Button variant="destructive">Clear Data</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>Manage your profiles and switch between different key sets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Create New Profile</p>
              <p className="text-sm text-muted-foreground">Start fresh with a new set of keys</p>
            </div>
            <Button onClick={() => setIsCreateProfileDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Profile
            </Button>
          </div>
          <Separator />
          <div>
            <p className="font-medium mb-3">Existing Profiles</p>
            <div className="space-y-2">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">{getIconComponent(profile.icon)}</div>
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.keys?.length || 0} keys • Created{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {profile.id === currentProfileId && (
                      <Badge variant="default" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProfile(profile)
                        setIsEditProfileDialogOpen(true)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {profiles.length > 1 && (
                      <Button size="sm" variant="destructive" onClick={() => deleteProfile(profile.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Profile Dialog */}
      <Dialog open={isCreateProfileDialogOpen} onOpenChange={setIsCreateProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>Create a new profile for tracking different key sets</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input
                id="profile-name"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                placeholder="e.g., Main Account, Alt Account"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-icon">Profile Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {PROFILE_ICONS.map((icon) => (
                  <Button
                    key={icon}
                    variant={newProfile.icon === icon ? "default" : "outline"}
                    className="h-12 flex flex-col items-center justify-center gap-1"
                    onClick={() => setNewProfile({ ...newProfile, icon })}
                  >
                    {getIconComponent(icon)}
                    <span className="text-xs">{icon}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createProfile}>Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile details</DialogDescription>
          </DialogHeader>
          {editingProfile && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-profile-name">Profile Name</Label>
                <Input
                  id="edit-profile-name"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-profile-icon">Profile Icon</Label>
                <div className="grid grid-cols-4 gap-2">
                  {PROFILE_ICONS.map((icon) => (
                    <Button
                      key={icon}
                      variant={editingProfile.icon === icon ? "default" : "outline"}
                      className="h-12 flex flex-col items-center justify-center gap-1"
                      onClick={() => setEditingProfile({ ...editingProfile, icon })}
                    >
                      {getIconComponent(icon)}
                      <span className="text-xs">{icon}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={updateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}