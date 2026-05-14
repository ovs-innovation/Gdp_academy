const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export interface DanceStyle {
  _id: string
  name: string
  description?: string
  image?: string
  slug?: string
  status: string
  createdBy?: {
    _id: string
    name: string
    email: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface DanceStylesResponse {
  categories: DanceStyle[]
  count: number
}

export const fetchDanceStyles = async (status?: string): Promise<DanceStylesResponse> => {
  const params = new URLSearchParams()
  if (status) {
    params.append('status', status)
  }

  const response = await fetch(`${API_BASE_URL}/public/categories?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch Dance Styles')
  }

  return await response.json()
}

export const fetchDanceStyle = async (id: string): Promise<{ category: DanceStyle }> => {
  const response = await fetch(`${API_BASE_URL}/public/categories/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch Dance Style')
  }

  return await response.json()
}
