/**
 * Generates user initials from full name
 * @param name - Full name of the user
 * @returns Initials (max 2 characters)
 */
export function generateInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return 'U' // Default fallback for "User"
  }

  const words = name.trim().split(/\s+/)

  if (words.length === 1) {
    // Single word - take first two letters
    return words[0].substring(0, 2).toUpperCase()
  } else {
    // Multiple words - take first letter of first two words
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
  }
}

/**
 * Generates a consistent color based on user name
 * @param name - User name
 * @returns Tailwind color class
 */
export function generateAvatarColor(name: string): string {
  // Simple hash function to generate consistent color
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff
  }

  // Array of nice background colors that work well with white text
  const colors = [
    'bg-blue-300',
    'bg-green-300',
    'bg-purple-300',
    'bg-pink-300',
    'bg-orange-300',
    'bg-indigo-300',
    'bg-teal-300',
    'bg-red-300',
  ]

  return colors[Math.abs(hash) % colors.length]
}
