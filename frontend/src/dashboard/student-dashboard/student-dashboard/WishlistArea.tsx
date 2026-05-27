import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    } catch {
      toast.error('Failed to load wishlist')
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
      toast.success('Removed from wishlist')
      fetchWishlist()
    } catch {
      toast.error('Failed to update wishlist')
    }
  }

  if (loading) {
    return <div className="gdp-loading"><div className="gdp-spinner"></div></div>
  }

  if (wishlist.length === 0) {
    return (
      <div className="gdp-info-card">
        <div className="gdp-empty-state">
          <i className="fas fa-heart-broken"></i>
          <h6>Your wishlist is empty</h6>
          <p>Explore our programs and save coaches you love for later.</p>
          <Link to="/programs" className="gdp-btn-primary">Explore Programs</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="gdp-wishlist-grid">
      {wishlist.map((item) => (
        <div key={item._id} className="gdp-wishlist-card">
          <div className="gdp-wishlist-card__img">
            <img
              src={item.photo || '/assets/img/courses/details_instructors02.jpg'}
              alt={item.name}
            />
            <button
              className="gdp-wishlist-card__remove"
              onClick={() => handleRemove(item._id)}
              aria-label="Remove from wishlist"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="gdp-wishlist-card__body">
            <h6>{item.name}</h6>
            <p>{item.teacherProfile?.bio?.substring(0, 80) || 'Expert dance coach'}...</p>
            <div className="gdp-wishlist-card__footer">
              <span className="gdp-wishlist-card__rating">
                <i className="fas fa-star"></i>
                {item.teacherProfile?.rating || 'New'}
              </span>
              <Link to={`/coaches/${item._id}`} className="gdp-btn-outline-sm" style={{ marginTop: 0 }}>
                View Profile
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WishlistArea
