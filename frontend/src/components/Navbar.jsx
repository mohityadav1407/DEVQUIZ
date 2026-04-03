import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-400">DevQuiz 🚀</Link>
      <div className="flex gap-6 text-sm text-gray-300 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link to="/quiz" className="hover:text-white transition">Quiz</Link>
            <Link to="/notes" className="hover:text-white transition">Notes</Link>
            <span className="text-indigo-300">Hi, {user.name} 👋</span>
            <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 px-4 py-1.5 rounded-lg transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition text-white">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}