import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { resolvePhotoUrl } from '../../../utils/uploadProfilePhoto'
import '../../../styles/dashboard-premium.css'

const ProfileSettingArea = () => {
  const { user, updateUserProfile, uploadProfilePhoto } = useAuth() as any
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
  })

  const getAvatar = () => {
    const raw = user?.photo || user?.avatar || user?.profile?.photo
    return raw ? resolvePhotoUrl(raw) : '/assets/img/courses/details_instructors02.jpg'
  }

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ')
      setFormData({
        firstName: user.firstName || nameParts[0] || '',
        lastName: user.lastName || nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || user.profile?.phone || '',
        bio: user.bio || '',
        location: user.location || user.profile?.city || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadProfilePhoto(file)
      toast.success('Profile photo updated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateUserProfile({
        phone: formData.phone,
        location: formData.location,
      })
      toast.success('Profile updated successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gdp-form-card">
      <div className="gdp-profile-upload">
        <div className="gdp-profile-upload__preview">
          <img src={getAvatar()} alt="Profile" className="gdp-profile-upload__avatar" />
          {uploading && (
            <div className="gdp-profile-upload__overlay">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          )}
        </div>
        <div className="gdp-profile-upload__info">
          <h6>Profile Photo</h6>
          <p>Upload a clear photo. JPG, PNG, WebP or GIF — max 5 MB.</p>
          <div className="gdp-profile-upload__actions">
            <button
              type="button"
              className="gdp-btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <button
              type="button"
              className="gdp-btn-outline-sm"
              style={{ marginTop: 0 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Change Image
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>
      </div>

      <div className="gdp-form-divider" />

      <form onSubmit={handleSubmit}>
        <div className="gdp-form-grid">
          <div className="gdp-form-group">
            <label className="gdp-form-label">First Name</label>
            <input type="text" name="firstName" value={formData.firstName} className="gdp-form-input" readOnly />
          </div>
          <div className="gdp-form-group">
            <label className="gdp-form-label">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} className="gdp-form-input" readOnly />
          </div>
          <div className="gdp-form-group">
            <label className="gdp-form-label">Email Address</label>
            <input type="email" name="email" value={formData.email} readOnly className="gdp-form-input" />
          </div>
          <div className="gdp-form-group">
            <label className="gdp-form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="gdp-form-input"
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="gdp-form-group gdp-form-group--full">
            <label className="gdp-form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="gdp-form-input"
              placeholder="City, Country"
            />
          </div>
        </div>
        <div style={{ marginTop: '28px' }}>
          <button type="submit" disabled={loading} className="gdp-btn-primary">
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Saving...</>
            ) : (
              <><i className="fas fa-save"></i> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileSettingArea
