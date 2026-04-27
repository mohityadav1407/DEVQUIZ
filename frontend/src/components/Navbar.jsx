import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <Link to="/" className="text-xl font-bold text-indigo-400">
        DevQuiz 🚀
      </Link>

      <div className="flex gap-2 items-center">
        {user ? (
          <>
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/quiz', label: 'Quiz' },
              { path: '/notes', label: 'Notes' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm transition
                  ${isActive(path)
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                {label}
              </Link>
            ))}
            <span className="text-gray-500 text-sm ml-2 mr-1">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}