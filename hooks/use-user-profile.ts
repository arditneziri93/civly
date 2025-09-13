import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'
import {
  fetchUserProfile,
  type UserProfile,
} from '@/services/user-profile.service'

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      setLoading(true)
      fetchUserProfile(user.id)
        .then(setProfile)
        .finally(() => setLoading(false))
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user?.id])

  return {
    profile,
    loading,
    user,
  }
}
