import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { getWishlist, toggleWishlist } from '../../../services/wishlistService'
import { toast } from 'react-toastify'
import '../../../styles/dashboard-premium.css'

const WishlistArea = () => {
  const { token } = useAuth() as any
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = async () => {
    if (!token) return
    try {
      setLoading(true)
      const data = await getWishlist(token)
      setWishlist(data.wishlist || [])
    } catch (err) {
      toast.error("Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [token])

  const handleRemove = async (teacherId: string) => {
    try {
      await toggleWishlist(token, teacherId)
      toast.success("Removed from wishlist")
      fetchWishlist()
    } catch (err) {
      toast.error("Failed to update wishlist")
    }
  }

  return (
    <div className="dashboard__content-wrap">
      <div className="dashboard__content-title mb-4">
        <h4 className="title text-white">MY WISHLIST</h4>
        <p className="text-dim small">Courses and Coaches you've saved for later.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : wishlist.length === 0 ? (
        <div className="stat-card p-5 text-center">
           <i className="fas fa-heart-broken mb-3 opacity-20" style={{ fontSize: '40px' }}></i>
           <p className="text-dim mb-0">Your wishlist is empty. Explore our courses to add some!</p>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map((item) => (
            <div key={item._id} className="col-md-6 col-xl-4">
              <div className="stat-card h-100 p-0 overflow-hidden border-0" style={{ background: 'var(--card-bg)' }}>
                <div className="position-relative">
                   <img 
                    src={item.photo || "/assets/img/courses/details_instructors02.jpg"} 
                    alt={item.name} 
                    className="w-100" 
                    style={{ height: '180px', objectFit: 'cover' }}
                   />
                   <button 
                    className="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle" 
                    style={{ width: '32px', height: '32px', padding: 0 }}
                    onClick={() => handleRemove(item._id)}
                   >
                     <i className="fas fa-times"></i>
                   </button>
                </div>
                <div className="p-3">
                  <h6 className="text-white mb-1">{item.name}</h6>
                  <p className="small text-dim mb-3">{item.teacherProfile?.bio?.substring(0, 60)}...</p>
                  <div className="d-flex justify-content-between align-items-center">
                     <span className="text-primary small fw-bold">
                        <i className="fas fa-star me-1 text-warning"></i> 
                        {item.teacherProfile?.rating || 'New'}
                     </span>
                     <a href={`/coaches/${item._id}`} className="btn btn-primary btn-sm px-3" style={{ fontSize: '10px' }}>VIEW PROFILE</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistArea
