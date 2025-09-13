'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import ProfilePicturePicker from './ProfilePicturePicker'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  CalendarIcon,
  User as UserIcon,
  LogOut,
  Save,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState<string | null>(null)
  const [surname, setSurname] = useState<string | null>(null)
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      // Get basic profile data from profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('name, surname, email, phone, avatar_url')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.log('Profile fetch error:', error)
      }

      // Set basic profile data
      if (profileData) {
        setName(profileData.name || '')
        setSurname(profileData.surname || '')
        setEmail(profileData.email || user?.email || '')
        setPhone(profileData.phone || '')
        setAvatarUrl(profileData.avatar_url || '')
      } else {
        // Fallback to auth user data
        setEmail(user?.email || '')
      }

      // Get extended data from user metadata
      const metadata = user?.user_metadata || {}
      setBirthdate(metadata.birthdate ? new Date(metadata.birthdate) : undefined)
      setLocation(metadata.location || '')
      setSummary(metadata.summary || '')
      setWebsite(metadata.website || '')

    } catch (error) {
      console.log('Error loading user data:', error)
      // Set fallback values from auth user
      setEmail(user?.email || '')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  const updateProfile = async ({
    name,
    surname,
    birthdate,
    email,
    phone,
    location,
    summary,
    website,
    avatar_url,
  }: {
    name: string | null
    surname: string | null
    birthdate: Date | undefined
    email: string | null
    phone: string | null
    location: string | null
    summary: string | null
    website: string | null
    avatar_url: string | null
  }) => {
    try {
      setLoading(true)

      // Basic profile data for profiles table
      const profileData = {
        name,
        surname,
        email,
        phone,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      // Extended profile data (store in user_metadata or separate table)
      const extendedData = {
        birthdate: birthdate instanceof Date ? birthdate.toISOString().split('T')[0] : null,
        location,
        summary,
        website,
      }

      console.log('Updating profile with data:', profileData)
      console.log('Extended data:', extendedData)

      // Update basic profile
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...profileData,
        })
        .select()

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      // Store extended data in user metadata for now
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          ...extendedData,
          name,
          surname,
        }
      })

      if (metadataError) {
        console.error('Metadata update error:', metadataError)
        // Don't throw error for metadata, it's supplementary
      }

      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating the data:', error)
      
      if (error instanceof Error) {
        alert(`Error updating profile: ${error.message}`)
      } else {
        alert('Error updating the data! Please check the console for details.')
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      return
    }

    try {
      setLoading(true)

      // Delete user account using Supabase Admin API
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '')

      if (error) throw error

      // Sign out after successful deletion
      await supabase.auth.signOut()

      alert('Account deleted successfully')
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and profile information.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border">
            <div className="flex flex-col items-center space-y-1">
              <ProfilePicturePicker
                uid={user?.id ?? null}
                url={avatar_url}
                size={80}
                onUpload={(url) => {
                  setAvatarUrl(url)
                }}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">
                Profile Picture
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Click to change • JPG, PNG, GIF • Max 5MB
              </p>
            </div>
          </div>

          {/* Username and Birthdate in same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-sm font-medium">
                Birthdate
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal focus-visible:ring-primary',
                      !birthdate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthdate ? (
                      format(birthdate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthdate}
                    captionLayout="dropdown"
                    onSelect={(date) => setBirthdate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Name and Surname in same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surname" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="surname"
                type="text"
                value={surname || ''}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Enter your last name"
                className="focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Email and Phone in same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone || ''}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Location and Website in same row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                value={location || ''}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Enter your website URL"
                className="focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Summary - full width */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium">
              Summary
            </Label>
            <Textarea
              id="summary"
              value={summary || ''}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a brief summary about yourself"
              rows={4}
              className="focus-visible:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            onClick={() =>
              updateProfile({
                name,
                surname,
                birthdate,
                email,
                phone,
                location,
                summary,
                website,
                avatar_url,
              })
            }
            disabled={loading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>

          <form action="/auth/signout" method="post">
            <Button
              variant="outline"
              type="submit"
              className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-12">
        <Card className="border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex-1">
                <h4 className="font-medium text-destructive mb-1">
                  Delete Account
                </h4>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. This
                  will permanently delete your account, all your resumes, and
                  remove all of your data from our servers.
                </p>
              </div>
              <Button
                onClick={deleteAccount}
                disabled={loading}
                variant="destructive"
                className="flex items-center gap-2 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
