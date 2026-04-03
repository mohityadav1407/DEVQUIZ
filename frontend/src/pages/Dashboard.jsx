import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MOCK_ACTIVITY = [
  { id: 1, type: 'quiz', label: 'Completed React Quiz', score: 8, total: 10, date: 'Today, 10:30 AM', icon: '🧠' },
  { id: 2, type: 'note', label: 'Created note: CSS Flexbox', date: 'Today, 9:15 AM', icon: '📝' },
  { id: 3, type: 'quiz', label: 'Completed Backend Quiz', score: 6, total: 10, date: 'Yesterday, 4:00 PM', icon: '🧠' },
  { id: 4, type: 'note', label: 'Created note: JWT Auth', date: 'Yesterday, 2:30 PM', icon: '📝' },
  { id: 5, type: 'quiz', label: 'Completed JS Quiz', score: 9, total: 10, date: '2 days ago', icon: '🧠' },
]

const CATEGORY_PROGRESS = [
  { label: 'Frontend', percent: 80, color: 'bg-purple-500' },
  { label: 'JavaScript', percent: 90, color: 'bg-yellow-500' },
  { label: 'React', percent: 75, color: 'bg-blue-500' },
  { label: 'Backend', percent: 60, color: 'bg-green-500' },
  { label: 'Database', percent: 45, color: 'bg-red-500' },
]

const QUICK_LINKS = [
  { label: 'Start Quiz', icon: '🧠', desc: 'Test your knowledge', to: '/quiz', color: 'border-indigo-800 hover:border-indigo-500' },
  { label: 'My Notes', icon: '📝', desc: 'Review your notes', to: '/notes', color: 'border-green-800 hover:border-green-500' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('activity')

  const stats = [
    { label: 'Quizzes Taken', value: 12, icon: '🧠', change: '+3 this week' },
    { label: 'Avg Score', value: '78%', icon: '🎯', change: '+5% vs last week' },
    { label: 'Notes Created', value: 8, icon: '📝', change: '+2 this week' },
    { label: 'Day Streak', value: 5, icon: '🔥', change: 'Keep it up!' },
  ]

  const getScoreColor = (score, total) => {
    const pct = (score / total) * 100
    if (pct >= 80) return 'text-green-400'
    if (pct >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-indigo-400">{user?.name || 'Developer'}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here's your learning progress at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition">
            <div className="text-2xl mb-3">{stat.icon}</div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-gray-400 text-xs mb-2">{stat.label}</p>
            <p className="text-indigo-400 text-xs">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {QUICK_LINKS.map((link, i) => (
          <Link
            key={i}
            to={link.to}
            className={`bg-gray-900 border rounded-2xl p-5 flex items-center gap-4 transition ${link.color}`}
          >
            <span className="text-3xl">{link.icon}</span>
            <div>
              <p className="text-white font-semibold">{link.label}</p>
              <p className="text-gray-500 text-xs">{link.desc}</p>
            </div>
            <span className="ml-auto text-gray-600">→</span>
          </Link>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 w-fit">
        {['activity', 'progress'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition
              ${activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'}`}
          >
            {tab === 'activity' ? '📋 Activity' : '📊 Progress'}
          </button>
        ))}
      </div>

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {MOCK_ACTIVITY.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition
                ${i !== MOCK_ACTIVITY.length - 1 ? 'border-b border-gray-800' : ''}`}
            >
              <div className="text-2xl w-10 text-center">{item.icon}</div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.date}</p>
              </div>
              {item.type === 'quiz' && (
                <span className={`text-sm font-bold ${getScoreColor(item.score, item.total)}`}>
                  {item.score}/{item.total}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <p className="text-gray-400 text-sm mb-2">Your knowledge by category</p>
          {CATEGORY_PROGRESS.map((cat, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-300">{cat.label}</span>
                <span className="text-gray-400">{cat.percent}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`${cat.color} h-2 rounded-full transition-all duration-700`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}

          <div className="border-t border-gray-800 pt-5 mt-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Overall Progress</p>
                <p className="text-2xl font-bold text-indigo-400 mt-1">70%</p>
              </div>
              <Link
                to="/quiz"
                className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              >
                Improve Score →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}