import { getStoredToken, getStoredUser, setStoredUser } from '../services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/** Resolve relative upload paths to a URL the browser can load */
export function resolvePhotoUrl(photo?: string | null): string {
  if (!photo) return ''
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo
  if (photo.startsWith('/uploads/')) {
    // Same origin in dev (vite proxies /uploads) and prod
    return photo
  }
  return photo
}

/**
 * Upload profile photo via backend (Cloudinary or local /uploads).
 * Saves to student profile and returns the photo URL.
 */
export async function uploadProfilePhoto(file: File): Promise<string> {
  const token = getStoredToken()
  if (!token) {
    throw new Error('You must be logged in to upload a photo.')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.')
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be smaller than 5 MB.')
  }

  const formData = new FormData()
  formData.append('photo', file)

  const response = await fetch(`${API_BASE_URL}/student-profiles/me/photo`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  let data: { message?: string; photo?: string; profile?: { photo?: string } } = {}
  const rawText = await response.text()
  try {
    data = rawText ? JSON.parse(rawText) : {}
  } catch {
    if (response.status === 404) {
      throw new Error('Photo upload is unavailable. Please restart the backend server and try again.')
    }
    throw new Error('Invalid server response while uploading photo.')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload photo. Please try again.')
  }

  const photoUrl = data.photo || data.profile?.photo
  if (!photoUrl) {
    throw new Error('Upload succeeded but no photo URL was returned.')
  }

  const currentUser = getStoredUser()
  if (currentUser) {
    setStoredUser({
      ...currentUser,
      photo: photoUrl,
      avatar: photoUrl,
      image: photoUrl,
    })
  }

  return photoUrl
}
