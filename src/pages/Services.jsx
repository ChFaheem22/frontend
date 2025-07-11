import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const Services = () => {
  const { category } = useParams()
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  // Get user from localStorage (you can adapt this based on your auth setup)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchProviders()
  }, [category])

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`/api/providers/category/${category}`)
      setProviders(response.data)
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mt-4">Loading providers...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="mt-4 mb-4">
        <h2>{capitalizeFirst(category)} Services</h2>
        <p>Find experienced {category}s in your area</p>
      </div>

      {providers.length === 0 ? (
        <div className="text-center">
          <p>No providers found for {category} services.</p>
          <Link to="/" className="btn btn-primary">Browse All Services</Link>
        </div>
      ) : (
        <div className="providers-grid">
          {providers.map((provider) => (
            <div key={provider._id} className="provider-card">
              <div className="provider-info">
                <div className="provider-name">{provider.name}</div>
                <div className="provider-rating">
                  ⭐ {provider.rating || 4.5} ({provider.reviewCount || 0} reviews)
                </div>
                <p><strong>Experience:</strong> {provider.experience} years</p>
                <p><strong>Phone:</strong> {provider.phone}</p>
                <p>{provider.description}</p>
              </div>

              {user && user.role !== 'provider' && (
                <Link 
                  to={`/book/${provider._id}`} 
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Book Service
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Services
