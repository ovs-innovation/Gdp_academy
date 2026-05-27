import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

interface DashboardBannerTwoProps {
  totalSessions?: number
  completedSessions?: number
}

const DashboardBannerTwo = ({ totalSessions = 0, completedSessions = 0 }: DashboardBannerTwoProps) => {
  const { user, updateUserProfile } = useAuth() as any
  const [uploading, setUploading] = useState(false)

  const getMemberName = () => {
    return user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email?.split('@')[0] || 'Member'
  }

  const getProfilePicture = () => {
    return user?.photo || "/assets/img/courses/details_instructors02.jpg"
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET || "");
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) await updateUserProfile({ photo: data.secure_url });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard__top-wrap mb-4">
      <div className="dashboard__top-bg" style={{ background: 'var(--highlight-gradient)', opacity: 0.2 }}></div>
      <div className="dashboard__instructor-info py-4">
        <div className="dashboard__instructor-info-left align-items-center">
          <div className="thumb position-relative" style={{ border: 'none' }}>
            <img src={getProfilePicture()} alt={getMemberName()} className="rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid var(--primary-color)' }} />
            <label htmlFor="profile-upload" className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer shadow">
               <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-camera'} text-white`} style={{ fontSize: '12px' }}></i>
            </label>
            <input id="profile-upload" type="file" accept="image/*" className="d-none" onChange={handleImageUpload} disabled={uploading} />
          </div>
          <div className="content">
            <h2 className="title mb-1 text-white" style={{ fontSize: '28px' }}>{getMemberName()}</h2>
            <div className="d-flex gap-3 align-items-center opacity-75 flex-wrap">
               <span className="small"><i className="fas fa-graduation-cap me-2 text-primary"></i>Member</span>
               <span className="small"><i className="fas fa-map-marker-alt me-2 text-primary"></i>Elite Academy</span>
               {totalSessions > 0 && (
                 <span className="small"><i className="fas fa-calendar-check me-2 text-success"></i>{completedSessions}/{totalSessions} Sessions Completed</span>
               )}
            </div>
          </div>
        </div>
        <div className="dashboard__instructor-info-right">
          <Link to="/programs" className="btn btn-primary px-4 py-2" style={{ borderRadius: '12px' }}>
             <i className="fas fa-calendar-plus me-2"></i>Book New Session
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardBannerTwo
