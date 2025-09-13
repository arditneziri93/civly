'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { Upload, User, X } from 'lucide-react'

export default function ProfilePicturePicker({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        console.log('Error uploading avatar:', uploadError)
        return
      }

      onUpload(filePath)
    } catch (error) {
      console.log('Error uploading avatar:', error)
    } finally {
      setUploading(false)
      // Reset the input value so the same file can be selected again
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const removeAvatar = async () => {
    try {
      if (!url) return

      setUploading(true)

      // Remove from storage
      const { error } = await supabase.storage.from('avatars').remove([url])

      if (error) {
        console.log('Error removing from storage:', error)
        // Don't throw error if file doesn't exist, just continue
      }

      // Clear the avatar URL regardless of storage removal result
      setAvatarUrl(null)
      onUpload('')
    } catch (error) {
      console.log('Error removing avatar:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative">
      {/* Avatar Display */}
      <div className="relative group cursor-pointer">
        <div
          className="relative rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
          style={{ width: size, height: size }}
        >
          {avatarUrl ? (
            <Image
              width={size}
              height={size}
              src={avatarUrl}
              alt="Profile Picture"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <User className="w-10 h-10 text-primary/60" />
            </div>
          )}

          {/* Hover overlay for upload */}
          <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Loading indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Remove button - only show when there's an avatar */}
      {avatarUrl && !uploading && (
        <button
          onClick={removeAvatar}
          className="absolute -top-2 -right-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-800 rounded-full p-1.5 shadow-sm transition-colors cursor-pointer"
          title="Remove profile picture"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
