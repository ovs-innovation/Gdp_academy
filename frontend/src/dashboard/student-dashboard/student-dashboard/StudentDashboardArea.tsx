import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../contexts/AuthContext'
import { getMyBookings, cancelBooking, getAvailableSlots, rescheduleBooking } from "../../../services/bookingService"
import type { Booking } from '../../../services/bookingService'
import DashboardBannerTwo from '../../dashboard-common/DashboardBannerTwo'
import DashboardSidebarTwo from '../../dashboard-common/DashboardSidebarTwo'
import { toast } from 'react-toastify'
import '../../../styles/dashboard-premium.css'

const StudentDashboardArea = () => {
  const { t } = useTranslation()
  const { token, user } = useAuth() as any
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Reschedule States
  const [rescheduleBookingId, setRescheduleBookingId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const fetchBookings = async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await getMyBookings(token)
      setBookings(data)
    } catch (err: any) {
      toast.error("Failed to load sessions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [token])

  const handleBookingCancel = async (bookingId: string, scheduledAt: string) => {
    setOpenDropdownId(null);
    const sessionDate = new Date(scheduledAt);
    const now = new Date();
    if ((sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60) < 24) {
      toast.error("Cannot cancel within 24 hours.");
      return;
    }
    if (window.confirm("Are you sure you want to cancel this session?")) {
      try {
        await cancelBooking(bookingId, token);
        toast.success("Cancelled successfully.");
        fetchBookings();
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const handleReschedule = async (bookingId: string) => {
    setOpenDropdownId(null);
    const booking = bookings.find(b => b._id === bookingId);
    if (!booking) return;

    setRescheduleBookingId(bookingId);
    setLoadingSlots(true);
    try {
      const tcId = typeof booking.teacherProgramId === 'object' ? (booking.teacherProgramId as any)._id : booking.teacherProgramId;
      const slots = await getAvailableSlots(tcId, token);
      setAvailableSlots(slots);
    } catch (err: any) {
      toast.error("Error fetching slots");
      setRescheduleBookingId(null);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleBookingId || !selectedSlotId) return;
    setIsRescheduling(true);
    try {
      await rescheduleBooking(rescheduleBookingId, selectedSlotId, token);
      toast.success("Rescheduled successfully.");
      setRescheduleBookingId(null);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsRescheduling(false);
    }
  };

  const now = new Date()
  const upcomingBookings = bookings.filter(b => {
    const d = b.lesson?.scheduledAt ? new Date(b.lesson.scheduledAt) : new Date(b.sessionDate);
    return d > now && b.status !== 'cancelled'
  }).sort((a,b) => new Date(a.lesson?.scheduledAt || a.sessionDate).getTime() - new Date(b.lesson?.scheduledAt || b.sessionDate).getTime())

  const completedBookings = bookings.filter(b => {
    const d = b.lesson?.scheduledAt ? new Date(b.lesson.scheduledAt) : new Date(b.sessionDate);
    return (d <= now || b.status === 'completed') && b.status !== 'cancelled'
  }).sort((a,b) => new Date(b.lesson?.scheduledAt || b.sessionDate).getTime() - new Date(a.lesson?.scheduledAt || a.sessionDate).getTime())

  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  const getCoachName = (b: Booking) => (b.teacherId as any)?.name || "Expert Coach"
  const getProgName = (b: Booking) => (b.courseId as any)?.name?.en || (b.courseId as any)?.name || "Premium Dance Class"

  const formatDT = (dStr: string) => {
    const d = new Date(dStr)
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      day: d.getDate(),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    }
  }

  const nextClass = upcomingBookings[0]

  return (
    <section className="dashboard-academy">
      <div className="container">
        <DashboardBannerTwo totalSessions={bookings.length} completedSessions={completedBookings.length} />
        
        <div className="row g-4 mt-2">
          <DashboardSidebarTwo />
          
          <div className="col-lg-9">
            <div className="dashboard__content-wrap">
              
              {/* Quick Action & Stats Row */}
              <div className="row g-4 mb-4">
                 <div className="col-md-8">
                    {nextClass ? (
                       <div className="stat-card next-highlight h-100" style={{ textAlign: 'left', border: '1px solid var(--primary-color)' }}>
                          <div className="d-flex justify-content-between align-items-start">
                             <div>
                                <span className="badge bg-primary mb-2">NEXT UP</span>
                                <h4 className="mb-1 text-white">{getProgName(nextClass)}</h4>
                                <p className="mb-0 text-dim"><i className="far fa-user-circle me-2"></i>Coach: {getCoachName(nextClass)}</p>
                             </div>
                             <div className="text-end">
                                <h5 className="text-primary mb-0">{formatDT(nextClass.session?.scheduledAt || nextClass.sessionDate).time}</h5>
                                <p className="small text-dim">{formatDT(nextClass.session?.scheduledAt || nextClass.sessionDate).full}</p>
                             </div>
                          </div>
                          <div className="mt-4">
                             {nextClass.meeting?.joinUrlMember && (
                                <a href={nextClass.meeting.joinUrlMember} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-100">
                                   <i className="fas fa-video me-2"></i>JOIN LIVE SESSION
                                </a>
                             )}
                          </div>
                       </div>
                    ) : (
                       <div className="stat-card h-100 d-flex align-items-center justify-content-center p-5">
                          <div className="text-center">
                             <i className="fas fa-calendar-plus mb-3 opacity-20" style={{ fontSize: '40px' }}></i>
                             <p className="text-dim">No upcoming sessions. Time to book one!</p>
                          </div>
                       </div>
                    )}
                 </div>
                 <div className="col-md-4">
                    <div className="stat-card h-100 d-flex flex-column justify-content-center">
                       <p className="small text-dim mb-1">TOTAL CLASSES</p>
                       <h2 className="mb-0 text-white">{bookings.length}</h2>
                       <div className="mt-3 pt-3 border-top border-secondary border-opacity-10">
                          <p className="small text-dim mb-0"><span className="text-success">{completedBookings.length}</span> Completed</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Tabs Section */}
              <div className="dashboard__nav-tabs">
                <button className={activeTab === 'upcoming' ? 'active' : ''} onClick={() => setActiveTab('upcoming')}>UPCOMING</button>
                <button className={activeTab === 'completed' ? 'active' : ''} onClick={() => setActiveTab('completed')}>COMPLETED</button>
                <button className={activeTab === 'cancelled' ? 'active' : ''} onClick={() => setActiveTab('cancelled')}>CANCELLED</button>
              </div>

              {/* Sessions List */}
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
              ) : (
                <div className="lessons-list">
                  {(activeTab === 'upcoming' ? upcomingBookings : activeTab === 'completed' ? completedBookings : cancelledBookings).length === 0 ? (
                     <div className="text-center py-5 opacity-50">
                        <p>No sessions found in this category.</p>
                     </div>
                  ) : (activeTab === 'upcoming' ? upcomingBookings : activeTab === 'completed' ? completedBookings : cancelledBookings).map((b) => {
                    const dt = formatDT(b.session?.scheduledAt || b.sessionDate)
                    return (
                      <div key={b._id} className="booking-item-card">
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <div className="date-box">
                              <div className="month">{dt.month}</div>
                              <div className="day">{dt.day}</div>
                              <div className="time">{dt.time}</div>
                            </div>
                          </div>
                          <div className="col-md-7">
                            <div className="info-box">
                              <h6 className="mb-1">{getProgName(b)}</h6>
                              <p className="mb-0 text-dim">Coach: {getCoachName(b)} • {b.duration} Mins Session</p>
                            </div>
                          </div>
                          <div className="col-md-3 text-end">
                            <div className="d-flex gap-2 justify-content-end align-items-center booking-action-menu">
                              {activeTab === 'upcoming' && b.meeting?.joinUrlMember && (
                                <a href={b.meeting.joinUrlMember} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm px-3">JOIN</a>
                              )}
                              {activeTab === 'upcoming' && (
                                <div className="position-relative">
                                  <button className="btn btn-dark btn-sm p-2" style={{ borderRadius: '10px' }} onClick={() => setOpenDropdownId(openDropdownId === b._id ? null : b._id)}>
                                    <i className="fas fa-ellipsis-v"></i>
                                  </button>
                                  {openDropdownId === b._id && (
                                    <div className="dropdown-menu show dropdown-menu-end" style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', right: 0, zIndex: 10 }}>
                                      <button className="dropdown-item text-white py-2" onClick={() => handleReschedule(b._id)}>Reschedule</button>
                                      <button className="dropdown-item text-danger py-2" onClick={() => handleBookingCancel(b._id, b.session?.scheduledAt || b.sessionDate)}>Cancel</button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {rescheduleBookingId && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
               <h5 className="mb-0">Select New Availability</h5>
               <button className="btn-close btn-close-white" onClick={() => setRescheduleBookingId(null)}></button>
            </div>
            <div className="row g-3">
              {loadingSlots ? <div className="text-center w-100"><div className="spinner-border text-primary"></div></div> :
                availableSlots.length === 0 ? <p className="text-center text-dim">No alternative slots available.</p> :
                availableSlots.map(slot => (
                  <div key={slot._id} className="col-sm-6">
                    <button className={`btn w-100 text-start p-3 border ${selectedSlotId === slot._id ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
                            onClick={() => setSelectedSlotId(slot._id)} style={{ borderRadius: '15px' }}>
                      <div className="fw-bold">{new Date(slot.date).toLocaleDateString()}</div>
                      <div className="small text-dim">{slot.startTime}</div>
                    </button>
                  </div>
                ))}
            </div>
            <div className="d-flex gap-3 mt-4 justify-content-end">
              <button className="btn btn-secondary px-4" onClick={() => setRescheduleBookingId(null)} style={{ borderRadius: '15px' }}>Cancel</button>
              <button className="btn btn-primary px-4" onClick={handleConfirmReschedule} disabled={!selectedSlotId || isRescheduling}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudentDashboardArea
