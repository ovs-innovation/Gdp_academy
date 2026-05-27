const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export interface Booking {
  _id: string
  memberId: string
  teacherId: string
  teacherProgramId: string
  programId: string
  languageId: string
  sessionDate: string
  startTime: string
  endTime: string
  duration: number
  timezone: string
  memberCount?: number // Number of members attending
  session: {
    duration: number
    scheduledAt: string
    timezone: string
  }
  meeting?: {
    provider: string
    meetingId: string
    joinUrlMember: string
    joinUrlTeacher: string
  }
  paymentStatus: string
  status?: string
  createdAt: string
  updatedAt: string
  // Populated fields
  teacher?: {
    _id: string
    firstName: string
    lastName: string
    profilePicture?: string
    teacherProfile?: {
      rating?: number
      totalReviews?: number
    }
  }
  program?: {
    _id: string
    name: string | { en: string }
    description?: string | { en: string }
  }
  language?: {
    _id: string
    name: string
  }
  lesson?: {
    scheduledAt: string
  }
  courseId?: string | {
    _id: string
    name: string | { en: string }
    description?: string | { en: string }
    image?: string
  }
}

export const getMyBookings = async (token: string): Promise<Booking[]> => {
  const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch bookings')
  }

  const data = await response.json()
  return data.bookings || []
}

export const getBookingById = async (id: string, token: string): Promise<Booking> => {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch booking')
  }

  const data = await response.json()
  return data.booking
}

export const cancelBooking = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'cancelled' }),
  })

  if (!response.ok) {
    throw new Error('Failed to cancel booking')
  }
}

export const getAvailableSlots = async (teacherProgramId: string, token: string): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/bookings/available-slots/${teacherProgramId}`, {
    headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
     throw new Error('Failed to fetch slots');
  }
  
  const data = await response.json();
  return data.availabilities || [];
}

export const rescheduleBooking = async (bookingId: string, availabilityId: string, token: string): Promise<Booking> => {
   const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/reschedule`, {
      method: 'POST',
      headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ availabilityId }),
   });
   
   if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to reschedule booking');
   }
   
   const data = await response.json();
   return data.booking;
}
