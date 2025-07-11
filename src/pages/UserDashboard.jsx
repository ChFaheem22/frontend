import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (user.role !== 'user') {
      navigate('/')
      return
    }
    
    fetchBookings()
  }, [user, navigate])

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/user')
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending'
      case 'confirmed': return 'status-confirmed'
      case 'completed': return 'status-completed'
      default: return 'status-pending'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mt-4">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}!</h1>
          <p>Manage your service bookings and requests</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div>Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div>Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div>Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
            <div>Completed</div>
          </div>
        </div>

        <div className="dashboard-header">
          <h2>Your Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center">
            <p>You haven't made any bookings yet.</p>
            <a href="/" className="btn btn-primary">Browse Services</a>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div>
                    <h3>{booking.provider?.name}</h3>
                    <p><strong>Service:</strong> {booking.provider?.category}</p>
                  </div>
                  <span className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="booking-details">
                  <p><strong>Date:</strong> {formatDate(booking.date)} at {booking.time}</p>
                  <p><strong>Address:</strong> {booking.address}</p>
                  <p><strong>Description:</strong> {booking.description}</p>
                  <p><strong>Provider Phone:</strong> {booking.provider?.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard