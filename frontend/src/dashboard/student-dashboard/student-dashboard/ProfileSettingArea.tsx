import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { toast } from 'react-toastify'
import '../../../styles/dashboard-premium.css'

const ProfileSettingArea = () => {
  const { user, updateUserProfile } = useAuth() as any
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUserProfile(formData)
      toast.success("Profile updated successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard__content-wrap">
      <div className="dashboard__content-title mb-4">
        <h4 className="title text-white">PROFILE SETTINGS</h4>
        <p className="text-dim small">Update your personal information and profile details.</p>
      </div>

      <div className="stat-card" style={{ textAlign: 'left' }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-dim small mb-2 text-uppercase fw-bold letter-spacing-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control bg-dark border-secondary border-opacity-25 text-white p-3"
                  style={{ borderRadius: '12px' }}
                  placeholder="Enter first name"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-dim small mb-2 text-uppercase fw-bold letter-spacing-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control bg-dark border-secondary border-opacity-25 text-white p-3"
                  style={{ borderRadius: '12px' }}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-dim small mb-2 text-uppercase fw-bold letter-spacing-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="form-control bg-dark border-secondary border-opacity-25 text-white p-3 opacity-50"
                  style={{ borderRadius: '12px', cursor: 'not-allowed' }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="text-dim small mb-2 text-uppercase fw-bold letter-spacing-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control bg-dark border-secondary border-opacity-25 text-white p-3"
                  style={{ borderRadius: '12px' }}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="text-dim small mb-2 text-uppercase fw-bold letter-spacing-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control bg-dark border-secondary border-opacity-25 text-white p-3"
                  style={{ borderRadius: '12px' }}
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="text-dim small mb-2 text-uppercase fw-bold letter-spacing-1">Bio / About Me</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-control bg-dark border-secondary border-opacity-25 text-white p-3"
                  style={{ borderRadius: '12px', minHeight: '120px' }}
                  placeholder="Tell us a bit about your dance journey..."
                ></textarea>
              </div>
            </div>
            <div className="col-md-12 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-5 py-3"
                style={{ borderRadius: '12px' }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>SAVING...</>
                ) : (
                  "SAVE CHANGES"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSettingArea
