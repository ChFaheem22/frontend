import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const BookService = () => {
  const { providerId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [provider, setProvider] = useState(null)
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    description: '',
    address: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (user.role !== 'user') {
      navigate('/')
      return
    }
    
    fetchProvider()
  }, [providerId, user, navigate])

  const fetchProvider = async () => {
    try {
      const response = await axios.get(`/api/providers/${providerId}`)
      setProvider(response.data)
    } catch (error) {
      setError('Provider not found')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await axios.post('/api/bookings', {
        ...bookingData,
        providerId
      })
      setSuccess('Booking request sent successfully!')
      setTimeout(() => {
        navigate('/dashboard/user')
      }, 2000)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mt-4">Loading provider details...</div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container">
        <div className="text-center mt-4">
          <h2>Provider Not Found</h2>
          <p>The requested service provider could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="text-center mb-3">Book Service</h2>
        
        {/* Provider Info */}
        <div className="provider-card mb-3">
          <div className="provider-name">{provider.name}</div>
          <div className="provider-rating">
            ⭐ {provider.rating || 4.5} ({provider.reviewCount || 0} reviews)
          </div>
          <p><strong>Service:</strong> {provider.category}</p>
          <p><strong>Experience:</strong> {provider.experience} years</p>
          <p><strong>Phone:</strong> {provider.phone}</p>
          <p>{provider.description}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Preferred Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={bookingData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Preferred Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={bookingData.time}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Service Address</label>
            <textarea
              id="address"
              name="address"
              value={bookingData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter your complete address..."
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Service Description</label>
            <textarea
              id="description"
              name="description"
              value={bookingData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the work you need done..."
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Sending Request...' : 'Book Service'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookService