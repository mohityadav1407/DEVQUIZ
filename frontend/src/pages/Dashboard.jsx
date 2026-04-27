import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStats } from '../utils/api'

const CATEGORY_COLORS = {
  Frontend: 'bg-purple-500',
  JavaScript: 'bg-yellow-500',
  React: 'bg-blue-500',
  Backend: 'bg-green-500',
  Database: 'bg-red-500',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('activity')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats()
        setStats(res.data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Quizzes Taken', value: stats?.stats?.totalQuizzes || 0, icon: '🧠' },
    { label: 'Avg Score', value: stats?.stats?.avgScore ? `${stats.stats.avgScore}%` : '0%', icon: '🎯' },
    { label: 'Notes Created', value: stats?.stats?.totalNotes || 0, icon: '📝' },
    { label: 'Categories', value: '5', icon: '📚' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-indigo-400">{user?.name || 'Developer'}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here is your learning progress</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="h-8 w-8 bg-gray-700 rounded mb-3" />
              <div className="h-6 w-16 bg-gray-700 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/quiz" className="bg-gray-900 border border-indigo-800 hover:border-indigo-500 rounded-2xl p-5 flex items-center gap-4 transition">
          <span className="text-3xl">🧠</span>
          <div>
            <p className="text-white font-semibold">Start Quiz</p>
            <p className="text-gray-500 text-xs">Test your knowledge</p>
          </div>
          <span className="ml-auto text-gray-600">→</span>
        </Link>
        <Link to="/notes" className="bg-gray-900 border border-green-800 hover:border-green-500 rounded-2xl p-5 flex items-center gap-4 transition">
          <span className="text-3xl">📝</span>
          <div>
            <p className="text-white font-semibold">My Notes</p>
            <p className="text-gray-500 text-xs">Review your notes</p>
          </div>
          <span className="ml-auto text-gray-600">→</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 w-fit">
        {['activity', 'progress'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition
              ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {tab === 'activity' ? '📋 Activity' : '📊 Progress'}
          </button>
        ))}
      </div>

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {stats?.recentActivity?.length > 0 ? (
            stats.recentActivity.map((item, i) => (
              <div
                key={item._id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition
                  ${i !== stats.recentActivity.length - 1 ? 'border-b border-gray-800' : ''}`}
              >
                <div className="text-2xl">🧠</div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.category} Quiz</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-bold ${item.percentage >= 80 ? 'text-green-400' : item.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {item.percentage}%
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p className="text-3xl mb-2">📭</p>
              <p>No activity yet — take a quiz!</p>
            </div>
          )}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <p className="text-gray-400 text-sm">Your knowledge by category</p>
          {Object.entries(stats?.stats?.categoryStats || {}).map(([cat, percent]) => (
            <div key={cat}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300">{cat}</span>
                <span className="text-gray-400">{percent}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`${CATEGORY_COLORS[cat] || 'bg-indigo-500'} h-2 rounded-full transition-all duration-700`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ))}
          <div className="border-t border-gray-800 pt-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Overall Average</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">
                  {stats?.stats?.avgScore || 0}%
                </p>
              </div>
              <Link to="/quiz" className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
                Improve Score →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}