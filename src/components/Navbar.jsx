import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            QuickFix
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            
            {user ? (
              <>
                <li>
                  <Link to={user.role === 'provider' ? '/dashboard/provider' : '/dashboard/user'}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <span>Welcome, {user.name}</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="btn btn-outline2">Login</Link></li>
                <li><Link to="/register" className="btn btn-primary">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar