import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProviderDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (user.role !== 'provider') {
      navigate('/')
      return
    }
    
    fetchBookings()
  }, [user, navigate])

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/provider')
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status })
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status } 
          : booking
      ))
    } catch (error) {
      console.error('Error updating booking status:', error)
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
          <p>Manage your service requests and bookings</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div>Total Requests</div>
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
          <h2>Service Requests</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center">
            <p>No service requests yet.</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div>
                    <h3>{booking.user?.name}</h3>
                    <p><strong>Service:</strong> {user.category}</p>
                  </div>
                  <span className={`booking-status ${getStatusClass(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="booking-details">
                  <p><strong>Date:</strong> {formatDate(booking.date)} at {booking.time}</p>
                  <p><strong>Customer Phone:</strong> {booking.user?.phone}</p>
                  <p><strong>Address:</strong> {booking.address}</p>
                  <p><strong>Description:</strong> {booking.description}</p>
                </div>

                {booking.status === 'pending' && (
                  <div className="mt-2">
                    <button 
                      onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                      className="btn btn-primary"
                      style={{ marginRight: '10px' }}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => updateBookingStatus(booking._id, 'rejected')}
                      className="btn btn-secondary"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="mt-2">
                    <button 
                      onClick={() => updateBookingStatus(booking._id, 'completed')}
                      className="btn btn-primary"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProviderDashboard