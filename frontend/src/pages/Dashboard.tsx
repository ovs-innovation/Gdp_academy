import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getMyBookings } from '../services/bookingService'
import type { Booking } from '../services/bookingService'
import { toast } from 'react-toastify'
import WishlistArea from '../dashboard/student-dashboard/student-dashboard/WishlistArea'
import ProfileSettingArea from '../dashboard/student-dashboard/student-dashboard/ProfileSettingArea'
import '../styles/dashboard-premium.css'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, token, logout, updateUserProfile } = useAuth() as any
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(true)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchBookings()
  }, [token])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getMyBookings(token)
      setBookings(data)
    } catch { } finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET || '')
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.secure_url) { await updateUserProfile({ photo: data.secure_url }); toast.success('Photo updated!') }
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  // Stats Logic
  const now = new Date()
  const completedBookings = bookings.filter(b => (new Date(b.lesson?.scheduledAt || b.sessionDate) <= now || b.status === 'completed') && b.status !== 'cancelled')
  const totalHours = bookings.reduce((sum, b) => sum + (b.duration || 0), 0) / 60

  // Group bookings by program for "My Courses"
  const courseMap = new Map<string, { name: string; instructor: string; total: number; completed: number; image?: string }>()
  bookings.forEach(b => {
    const progName = (b.courseId as any)?.name?.en || (b.courseId as any)?.name || 'Dance Class'
    const coach = (b.teacherId as any)?.name || 'Coach'
    const img = (b.courseId as any)?.image
    const key = progName
    const existing = courseMap.get(key)
    const isCompleted = new Date(b.lesson?.scheduledAt || b.sessionDate) <= now || b.status === 'completed'
    if (existing) {
      existing.total++
      if (isCompleted) existing.completed++
    } else {
      courseMap.set(key, { name: progName, instructor: coach, total: 1, completed: isCompleted ? 1 : 0, image: img })
    }
  })
  const myCourses = Array.from(courseMap.values())

  const getMemberName = () => user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.name || user?.email?.split('@')[0] || 'Member'
  const getAvatar = () => user?.photo || user?.avatar || '/assets/img/courses/details_instructors02.jpg'
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'

  // Sidebar Logic
  const sidebarItems = [
    { icon: 'fas fa-arrow-left', label: 'Back to Home', path: '/', isSpecial: true },
    { icon: 'fas fa-play-circle', label: 'My Learning', path: '/dashboard', match: ['/dashboard', '/my-dashboard'] },
    { icon: 'fas fa-compass', label: 'Explore Courses', path: '/programs' },
    { icon: 'fas fa-user', label: 'My Profile', path: '/my-profile-setting', match: ['/my-profile-setting'] },
    { icon: 'fas fa-heart', label: 'Wishlist', path: '/my-wishlist', match: ['/my-wishlist'] },
    { icon: 'fas fa-cog', label: 'Settings', path: '/my-history', match: ['/my-history'] },
  ]

  const isActive = (item: any) => {
    if (item.match) return item.match.includes(location.pathname)
    return location.pathname === item.path
  }

  const renderContent = () => {
    switch (location.pathname) {
      case '/my-profile-setting': return <ProfileSettingArea />;
      case '/my-wishlist': return <WishlistArea />;
      case '/my-history': return (
        <div className="gdp-info-card">
          <h5>Order History</h5>
          {bookings.length === 0 ? <p className="text-dim">No transactions found.</p> : 
          bookings.map(b => (
            <div key={b._id} className="gdp-info-row">
               <div className="gdp-info-row__left">
                  <i className="fas fa-receipt"></i>
                  <div>
                    <div className="gdp-info-row__label">{(b.courseId as any)?.name || 'Course Payment'}</div>
                    <div className="gdp-info-row__value">ID: {b._id.substring(0, 8)}</div>
                  </div>
               </div>
               <div className="text-success fw-bold">PAID</div>
            </div>
          ))}
        </div>
      );
      default: return (
        <>
          <div className="gdp-profile-card">
            <div className="gdp-profile__avatar-wrap">
              <img src={getAvatar()} alt={getMemberName()} className="gdp-profile__avatar" />
              <label htmlFor="avatar-upload" className="gdp-profile__avatar-upload">
                <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
              </label>
              <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploading} />
            </div>
            <div className="gdp-profile__info">
              <h3>{getMemberName()}</h3>
              <div className="gdp-profile__tagline">{user?.bio || 'Passionate dancer & learner'}</div>
              <div className="gdp-profile__meta">
                <span><i className="fas fa-envelope"></i> {user?.email}</span>
                <span><i className="fas fa-calendar-alt"></i> Joined {joinDate}</span>
              </div>
            </div>
          </div>

          <div className="gdp-progress">
            <h5 className="gdp-progress__title">Learning Analytics</h5>
            <div className="gdp-progress__grid">
              <div className="gdp-progress__stat">
                <div className="gdp-progress__stat-icon"><i className="fas fa-graduation-cap"></i></div>
                <h3>{myCourses.length}</h3>
                <p>Enrolled</p>
              </div>
              <div className="gdp-progress__stat">
                <div className="gdp-progress__stat-icon"><i className="fas fa-hourglass-half"></i></div>
                <h3>{totalHours.toFixed(1)} <span style={{ fontSize: '12px' }}>HRS</span></h3>
                <p>Learning Time</p>
              </div>
              <div className="gdp-progress__stat">
                <div className="gdp-progress__stat-icon"><i className="fas fa-check-double"></i></div>
                <h3>{completedBookings.length}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>

          <div className="gdp-courses">
            <div className="gdp-courses__header"><h5>My Active Courses</h5><Link to="/programs">Explore New</Link></div>
            {loading ? <div className="text-center py-4"><div className="spinner-border text-primary"></div></div> :
             myCourses.length === 0 ? <p className="text-center text-dim py-4">No active courses. Start learning today!</p> :
             myCourses.map((c, i) => {
               const pct = Math.round((c.completed / c.total) * 100);
               return (
                 <div key={i} className="gdp-course-item">
                    <div className="gdp-course-item__thumb">{c.image ? <img src={c.image} alt={c.name} /> : <i className="fas fa-music"></i>}</div>
                    <div className="gdp-course-item__info"><h6>{c.name}</h6><p>Instructor: {c.instructor}</p></div>
                    <div className="gdp-course-item__progress">
                      <div className="gdp-progress-bar"><div className="gdp-progress-bar__fill" style={{ width: `${pct}%` }}></div></div>
                      <span className="gdp-course-item__pct">{pct}%</span>
                    </div>
                 </div>
               )
             })}
          </div>

          <div className="gdp-bottom-grid">
            <div className="gdp-info-card">
              <h5>Quick Account Overview</h5>
              <div className="gdp-info-row" onClick={() => navigate('/my-profile-setting')}>
                <div className="gdp-info-row__left"><i className="fas fa-id-card"></i><div><div className="gdp-info-row__label">Display Name</div><div className="gdp-info-row__value">{getMemberName()}</div></div></div>
                <i className="fas fa-chevron-right gdp-info-row__right"></i>
              </div>
              <div className="gdp-info-row">
                <div className="gdp-info-row__left"><i className="fas fa-envelope-open"></i><div><div className="gdp-info-row__label">Contact Email</div><div className="gdp-info-row__value">{user?.email}</div></div></div>
                <i className="fas fa-lock gdp-info-row__right" style={{ fontSize: '10px' }}></i>
              </div>
            </div>
            <div className="gdp-info-card">
              <h5>App Settings</h5>
              <div className="gdp-info-row">
                <div className="gdp-info-row__left"><i className="fas fa-bell"></i><div className="gdp-info-row__value">Push Notifications</div></div>
                <button className={`gdp-toggle ${notificationsOn ? 'active' : ''}`} onClick={() => setNotificationsOn(!notificationsOn)}></button>
              </div>
              <div className="gdp-info-row" onClick={() => navigate('/faq')}>
                <div className="gdp-info-row__left"><i className="fas fa-life-ring"></i><div className="gdp-info-row__value">Support Center</div></div>
                <i className="fas fa-chevron-right gdp-info-row__right"></i>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="gdp-dashboard">
      <aside className="gdp-sidebar">
        <div className="gdp-sidebar__logo">
          <Link to="/" className="dash-logo-container">
            <img src="/logo.png" alt="GDP" className="dash-site-logo" />
            <div className="dash-site-text">
              <span>Garima</span>
              <span>Dance</span>
              <span>Productions</span>
            </div>
          </Link>
        </div>
        <ul className="gdp-sidebar__nav">
          {sidebarItems.map(item => (
            <li key={item.label} className="gdp-sidebar__item">
              <Link to={item.path} className={`gdp-sidebar__link ${isActive(item) ? 'active' : ''} ${item.isSpecial ? 'special-link' : ''}`}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="gdp-sidebar__item" style={{ marginTop: '30px', borderTop: '1px solid var(--dash-border)', paddingTop: '16px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="gdp-sidebar__link logout-link">
              <i className="fas fa-sign-out-alt"></i><span>Logout Session</span>
            </a>
          </li>
        </ul>
      </aside>

      <main className="gdp-main">
        <div className="gdp-main__header">
          <h2 className="gdp-main__title">
            {location.pathname === '/my-profile-setting' ? 'Profile Management' : 
             location.pathname === '/my-wishlist' ? 'My Saved Lessons' :
             location.pathname === '/my-history' ? 'Payment History' : 'Student Dashboard'}
          </h2>
          <p className="gdp-main__subtitle">Monitor your dance progress and manage your account preferences.</p>
        </div>
        {renderContent()}
        <div className="gdp-dashboard__footer">© {new Date().getFullYear()} Garima Dance Production. Crafted for Excellence.</div>
      </main>
    </div>
  )
}

export default Dashboard
