import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getMyBookings } from '../services/bookingService'
import type { Booking } from '../services/bookingService'
import { toast } from 'react-toastify'
import WishlistArea from '../dashboard/student-dashboard/student-dashboard/WishlistArea'
import ProfileSettingArea from '../dashboard/student-dashboard/student-dashboard/ProfileSettingArea'
import { resolvePhotoUrl } from '../utils/uploadProfilePhoto'
import '../styles/dashboard-premium.css'

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, token, logout, uploadProfilePhoto } = useAuth() as any
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchBookings()
  }, [token])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getMyBookings(token)
      setBookings(data)
    } catch { /* silent */ } finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadProfilePhoto(file)
      toast.success('Photo updated!')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (avatarInputRef.current) avatarInputRef.current.value = ''
    }
  }

  const now = new Date()
  const upcomingBookings = bookings
    .filter(b => {
      const d = new Date(b.lesson?.scheduledAt || b.sessionDate)
      return d > now && b.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.lesson?.scheduledAt || a.sessionDate).getTime() - new Date(b.lesson?.scheduledAt || b.sessionDate).getTime())

  const completedBookings = bookings.filter(b =>
    (new Date(b.lesson?.scheduledAt || b.sessionDate) <= now || b.status === 'completed') && b.status !== 'cancelled'
  )
  const totalHours = bookings.reduce((sum, b) => sum + (b.duration || 0), 0) / 60

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
  const getAvatar = () => {
    const raw = user?.photo || user?.avatar || user?.profile?.photo
    return raw ? resolvePhotoUrl(raw) : '/assets/img/courses/details_instructors02.jpg'
  }
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatSessionDate = (dStr: string) => {
    const d = new Date(dStr)
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate(),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    }
  }

  const getProgName = (b: Booking) => (b.courseId as any)?.name?.en || (b.courseId as any)?.name || 'Dance Class'
  const getCoachName = (b: Booking) => (b.teacherId as any)?.name || 'Expert Coach'
  const nextSession = upcomingBookings[0]

  const sidebarItems = [
    { icon: 'fas fa-arrow-left', label: 'Back to Home', path: '/', isSpecial: true },
    { icon: 'fas fa-th-large', label: 'Overview', path: '/dashboard', match: ['/dashboard', '/my-dashboard'] },
    { icon: 'fas fa-compass', label: 'Explore Courses', path: '/programs' },
    { icon: 'fas fa-heart', label: 'Wishlist', path: '/my-wishlist', match: ['/my-wishlist'] },
    { icon: 'fas fa-receipt', label: 'Order History', path: '/my-history', match: ['/my-history'] },
    { icon: 'fas fa-user-cog', label: 'Profile Settings', path: '/my-profile-setting', match: ['/my-profile-setting'] },
  ]

  const isActive = (item: typeof sidebarItems[0]) => {
    if (item.match) return item.match.includes(location.pathname)
    return location.pathname === item.path
  }

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    '/my-profile-setting': { title: 'Profile Settings', subtitle: 'Manage your personal information and dance profile.' },
    '/my-wishlist': { title: 'My Wishlist', subtitle: 'Courses and coaches you have saved for later.' },
    '/my-history': { title: 'Order History', subtitle: 'Review your past bookings and payment records.' },
  }
  const currentPage = pageMeta[location.pathname] || {
    title: 'Student Dashboard',
    subtitle: 'Track your progress, upcoming sessions, and account at a glance.',
  }

  const quickActions = [
    { icon: 'fas fa-compass', label: 'Browse Programs', path: '/programs', color: 'purple' },
    { icon: 'fas fa-calendar-alt', label: 'Workshops', path: '/workshops', color: 'teal' },
    { icon: 'fas fa-video', label: 'Live Sessions', path: '/live-zoom', color: 'purple' },
    { icon: 'fas fa-life-ring', label: 'Get Support', path: '/faq', color: 'teal' },
  ]

  const renderOverview = () => (
    <>
      <div className="gdp-welcome-bar">
        <div className="gdp-welcome-bar__text">
          <span className="gdp-welcome-bar__greeting">{getGreeting()}, {user?.firstName || 'Dancer'} 👋</span>
          <p>Ready to move? You have <strong>{upcomingBookings.length}</strong> upcoming session{upcomingBookings.length !== 1 ? 's' : ''}.</p>
        </div>
        <div className="gdp-quick-actions">
          {quickActions.map(a => (
            <Link key={a.label} to={a.path} className={`gdp-quick-action gdp-quick-action--${a.color}`}>
              <i className={a.icon}></i>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {nextSession && (
        <div className="gdp-next-session">
          <div className="gdp-next-session__glow"></div>
          <div className="gdp-next-session__content">
            <div className="gdp-next-session__badge"><i className="fas fa-bolt"></i> NEXT SESSION</div>
            <h3>{getProgName(nextSession)}</h3>
            <p><i className="fas fa-user"></i> Coach: {getCoachName(nextSession)}</p>
            <div className="gdp-next-session__datetime">
              <i className="far fa-calendar"></i>
              {formatSessionDate(nextSession.lesson?.scheduledAt || nextSession.sessionDate).full}
              &nbsp;·&nbsp;
              <i className="far fa-clock"></i>
              {formatSessionDate(nextSession.lesson?.scheduledAt || nextSession.sessionDate).time}
            </div>
          </div>
          <div className="gdp-next-session__actions">
            {nextSession.meeting?.joinUrlMember ? (
              <a href={nextSession.meeting.joinUrlMember} target="_blank" rel="noopener noreferrer" className="gdp-btn-primary">
                <i className="fas fa-video"></i> Join Live
              </a>
            ) : (
              <Link to="/programs" className="gdp-btn-primary">
                <i className="fas fa-plus"></i> Book Session
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="gdp-stats-grid">
        {[
          { icon: 'fas fa-graduation-cap', value: myCourses.length, label: 'Enrolled Courses', color: 'purple' },
          { icon: 'fas fa-clock', value: totalHours.toFixed(1), suffix: 'hrs', label: 'Learning Time', color: 'teal' },
          { icon: 'fas fa-check-double', value: completedBookings.length, label: 'Completed', color: 'violet' },
          { icon: 'fas fa-calendar-check', value: upcomingBookings.length, label: 'Upcoming', color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className={`gdp-stat-card gdp-stat-card--${stat.color}`}>
            <div className="gdp-stat-card__icon"><i className={stat.icon}></i></div>
            <div className="gdp-stat-card__body">
              <h3>{stat.value}{stat.suffix && <small> {stat.suffix}</small>}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="gdp-two-col">
        <div className="gdp-profile-card">
          <div className="gdp-profile__avatar-wrap">
            <img src={getAvatar()} alt={getMemberName()} className="gdp-profile__avatar" />
            <label htmlFor="avatar-upload" className="gdp-profile__avatar-upload">
              <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
            </label>
            <input
              id="avatar-upload"
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </div>
          <div className="gdp-profile__info">
            <div className="gdp-profile__badge"><i className="fas fa-star"></i> Active Member</div>
            <h3>{getMemberName()}</h3>
            <div className="gdp-profile__tagline">{user?.bio || 'Passionate dancer & learner'}</div>
            <div className="gdp-profile__meta">
              <span><i className="fas fa-envelope"></i> {user?.email}</span>
              <span><i className="fas fa-calendar-alt"></i> Joined {joinDate}</span>
            </div>
            <div className="gdp-profile__actions">
              <button
                type="button"
                className="gdp-btn-outline-sm"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploading}
              >
                <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <button className="gdp-btn-outline-sm" onClick={() => navigate('/my-profile-setting')}>
                Edit Profile <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="gdp-sessions-card">
          <div className="gdp-sessions-card__header">
            <h5><i className="fas fa-list-ul"></i> Upcoming Sessions</h5>
            <span className="gdp-sessions-card__count">{upcomingBookings.length}</span>
          </div>
          {loading ? (
            <div className="gdp-loading"><div className="gdp-spinner"></div></div>
          ) : upcomingBookings.length === 0 ? (
            <div className="gdp-empty-state gdp-empty-state--sm">
              <i className="fas fa-calendar-plus"></i>
              <p>No sessions booked yet</p>
              <Link to="/programs" className="gdp-btn-outline-sm">Book a Class</Link>
            </div>
          ) : (
            <div className="gdp-session-list">
              {upcomingBookings.slice(0, 4).map(b => {
                const dt = formatSessionDate(b.lesson?.scheduledAt || b.sessionDate)
                return (
                  <div key={b._id} className="gdp-session-item">
                    <div className="gdp-session-item__date">
                      <span className="month">{dt.month}</span>
                      <span className="day">{dt.day}</span>
                    </div>
                    <div className="gdp-session-item__info">
                      <h6>{getProgName(b)}</h6>
                      <p>{getCoachName(b)} · {dt.time}</p>
                    </div>
                    {b.meeting?.joinUrlMember && (
                      <a href={b.meeting.joinUrlMember} target="_blank" rel="noopener noreferrer" className="gdp-session-item__join">
                        <i className="fas fa-video"></i>
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="gdp-courses">
        <div className="gdp-courses__header">
          <h5><i className="fas fa-book-open"></i> My Active Courses</h5>
          <Link to="/programs">Explore New <i className="fas fa-arrow-right"></i></Link>
        </div>
        {loading ? (
          <div className="gdp-loading"><div className="gdp-spinner"></div></div>
        ) : myCourses.length === 0 ? (
          <div className="gdp-empty-state">
            <i className="fas fa-music"></i>
            <h6>No active courses yet</h6>
            <p>Start your dance journey — explore our programs and book your first session.</p>
            <Link to="/programs" className="gdp-btn-primary">Explore Programs</Link>
          </div>
        ) : (
          myCourses.map((c, i) => {
            const pct = Math.round((c.completed / c.total) * 100)
            return (
              <div key={i} className="gdp-course-item">
                <div className="gdp-course-item__thumb">
                  {c.image ? <img src={c.image} alt={c.name} /> : <i className="fas fa-music"></i>}
                </div>
                <div className="gdp-course-item__info">
                  <h6>{c.name}</h6>
                  <p><i className="fas fa-chalkboard-teacher"></i> {c.instructor}</p>
                </div>
                <div className="gdp-course-item__progress">
                  <div className="gdp-progress-bar"><div className="gdp-progress-bar__fill" style={{ width: `${pct}%` }}></div></div>
                  <span className="gdp-course-item__pct">{pct}%</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="gdp-bottom-grid">
        <div className="gdp-info-card">
          <h5><i className="fas fa-id-card"></i> Account Overview</h5>
          <div className="gdp-info-row" onClick={() => navigate('/my-profile-setting')}>
            <div className="gdp-info-row__left">
              <i className="fas fa-user"></i>
              <div>
                <div className="gdp-info-row__label">Display Name</div>
                <div className="gdp-info-row__value">{getMemberName()}</div>
              </div>
            </div>
            <i className="fas fa-chevron-right gdp-info-row__right"></i>
          </div>
          <div className="gdp-info-row">
            <div className="gdp-info-row__left">
              <i className="fas fa-envelope-open"></i>
              <div>
                <div className="gdp-info-row__label">Contact Email</div>
                <div className="gdp-info-row__value">{user?.email}</div>
              </div>
            </div>
            <i className="fas fa-lock gdp-info-row__right"></i>
          </div>
          <div className="gdp-info-row" onClick={() => navigate('/my-history')}>
            <div className="gdp-info-row__left">
              <i className="fas fa-receipt"></i>
              <div>
                <div className="gdp-info-row__label">Total Bookings</div>
                <div className="gdp-info-row__value">{bookings.length} sessions</div>
              </div>
            </div>
            <i className="fas fa-chevron-right gdp-info-row__right"></i>
          </div>
        </div>

        <div className="gdp-info-card">
          <h5><i className="fas fa-sliders-h"></i> Preferences</h5>
          <div className="gdp-info-row">
            <div className="gdp-info-row__left">
              <i className="fas fa-bell"></i>
              <div className="gdp-info-row__value">Push Notifications</div>
            </div>
            <button className={`gdp-toggle ${notificationsOn ? 'active' : ''}`} onClick={() => setNotificationsOn(!notificationsOn)} aria-label="Toggle notifications"></button>
          </div>
          <div className="gdp-info-row" onClick={() => navigate('/faq')}>
            <div className="gdp-info-row__left">
              <i className="fas fa-life-ring"></i>
              <div className="gdp-info-row__value">Support Center</div>
            </div>
            <i className="fas fa-chevron-right gdp-info-row__right"></i>
          </div>
          <div className="gdp-info-row" onClick={() => navigate('/membership')}>
            <div className="gdp-info-row__left">
              <i className="fas fa-crown"></i>
              <div className="gdp-info-row__value">Upgrade Membership</div>
            </div>
            <i className="fas fa-chevron-right gdp-info-row__right"></i>
          </div>
        </div>
      </div>
    </>
  )

  const renderHistory = () => (
    <div className="gdp-info-card gdp-history-card">
      <div className="gdp-history-card__header">
        <h5><i className="fas fa-receipt"></i> Transaction History</h5>
        <span className="gdp-history-card__total">{bookings.length} total</span>
      </div>
      {loading ? (
        <div className="gdp-loading"><div className="gdp-spinner"></div></div>
      ) : bookings.length === 0 ? (
        <div className="gdp-empty-state gdp-empty-state--sm">
          <i className="fas fa-receipt"></i>
          <p>No transactions found yet.</p>
          <Link to="/programs" className="gdp-btn-outline-sm">Browse Programs</Link>
        </div>
      ) : (
        <div className="gdp-history-list">
          {bookings.map(b => {
            const dt = formatSessionDate(b.lesson?.scheduledAt || b.sessionDate)
            const status = b.status === 'cancelled' ? 'cancelled' : b.paymentStatus === 'paid' || b.paymentStatus === 'completed' ? 'paid' : 'pending'
            return (
              <div key={b._id} className="gdp-history-item">
                <div className="gdp-history-item__icon"><i className="fas fa-receipt"></i></div>
                <div className="gdp-history-item__info">
                  <h6>{getProgName(b)}</h6>
                  <p>{dt.full} · ID: {b._id.substring(0, 8).toUpperCase()}</p>
                </div>
                <span className={`gdp-status-badge gdp-status-badge--${status}`}>
                  {status === 'cancelled' ? 'Cancelled' : status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (location.pathname) {
      case '/my-profile-setting': return <ProfileSettingArea />
      case '/my-wishlist': return <WishlistArea />
      case '/my-history': return renderHistory()
      default: return renderOverview()
    }
  }

  return (
    <div className="gdp-dashboard">
      {sidebarOpen && <div className="gdp-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`gdp-sidebar ${sidebarOpen ? 'open' : ''}`}>
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

        <div className="gdp-sidebar__user">
          <img src={getAvatar()} alt="" className="gdp-sidebar__user-avatar" />
          <div>
            <div className="gdp-sidebar__user-name">{getMemberName()}</div>
            <div className="gdp-sidebar__user-role">Student</div>
          </div>
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
          <li className="gdp-sidebar__item gdp-sidebar__logout">
            <a href="#" onClick={(e) => { e.preventDefault(); logout() }} className="gdp-sidebar__link logout-link">
              <i className="fas fa-sign-out-alt"></i><span>Logout</span>
            </a>
          </li>
        </ul>

        <div className="gdp-sidebar__premium">
          <div className="gdp-sidebar__premium-badge">Premium Access</div>
          <p>Unlock exclusive workshops & 1-on-1 coaching sessions.</p>
          <Link to="/membership" className="gdp-sidebar__premium-btn">
            <i className="fas fa-crown"></i> Upgrade
          </Link>
        </div>
      </aside>

      <main className="gdp-main">
        <div className="gdp-main__topbar">
          <button className="gdp-mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <i className="fas fa-bars"></i>
          </button>
          <div className="gdp-main__header">
            <h2 className="gdp-main__title">{currentPage.title}</h2>
            <p className="gdp-main__subtitle">{currentPage.subtitle}</p>
          </div>
          <div className="gdp-main__topbar-actions">
            <Link to="/programs" className="gdp-topbar-btn" title="Book a class">
              <i className="fas fa-plus"></i>
            </Link>
            <button className="gdp-topbar-btn gdp-topbar-btn--avatar" onClick={() => navigate('/my-profile-setting')}>
              <img src={getAvatar()} alt="" />
            </button>
          </div>
        </div>

        {renderContent()}

        <div className="gdp-dashboard__footer">
          © {new Date().getFullYear()} Garima Dance Production · Crafted for Excellence
        </div>
      </main>
    </div>
  )
}

export default Dashboard
