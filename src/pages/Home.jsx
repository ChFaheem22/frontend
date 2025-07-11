import { Link } from 'react-router-dom'

const Home = () => {
  const services = [
    { name: 'Plumber', icon: '🔧', category: 'plumber', description: 'Fix pipes, leaks, and installations' },
    { name: 'Electrician', icon: '⚡', category: 'electrician', description: 'Electrical repairs and installations' },
    { name: 'Carpenter', icon: '🪚', category: 'carpenter', description: 'Furniture and woodwork services' },
    { name: 'Cleaner', icon: '🧹', category: 'cleaner', description: 'Home and office cleaning services' },
    { name: 'Painter', icon: '🎨', category: 'painter', description: 'Interior and exterior painting' },
    { name: 'Mechanic', icon: '🔩', category: 'mechanic', description: 'Vehicle repair and maintenance' }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Local Service Providers</h1>
          <p>Connect with trusted professionals in your area for all your service needs</p>
          <Link to="/register" className="btn btn-outline1">
            Get Started
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="container">
        <div className="text-center mb-4a">
          <h2>Our Services</h2>
          <p>Choose from a variety of professional services</p>
        </div>
        
        <div className="services-grid">
          {services.map((service) => (
            <Link 
              key={service.category} 
              to={`/services/${service.category}`} 
              className="service-card"
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container">
        <div className="text-center mb-4">
          <h2>How It Works</h2>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">1️⃣</div>
            <h3>Choose Service</h3>
            <p>Select the service you need from our categories</p>
          </div>
          <div className="service-card">
            <div className="service-icon">2️⃣</div>
            <h3>Find Provider</h3>
            <p>Browse available service providers in your area</p>
          </div>
          <div className="service-card">
            <div className="service-icon">3️⃣</div>
            <h3>Book Service</h3>
            <p>Schedule your appointment and get the job done</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home