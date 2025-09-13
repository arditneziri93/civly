import { createClient } from '@/utils/supabase/client'

export interface UserProfile {
  id: string
  name?: string
  surname?: string
  avatar_url?: string
  email?: string
}

export async function fetchUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const supabase = createClient()

  console.log('Fetching profile for user ID:', userId)

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  console.log('Profile fetch result:', { data, error })

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export function getDisplayName(profile: UserProfile | null): string {
  console.log('Getting display name for profile:', profile)

  if (!profile) return 'User'

  const firstName = profile.name || ''
  const lastName = profile.surname || ''
  const fullName = `${firstName} ${lastName}`.trim()

  console.log('Display name components:', { firstName, lastName, fullName })

  return fullName || profile.email || 'User'
}
