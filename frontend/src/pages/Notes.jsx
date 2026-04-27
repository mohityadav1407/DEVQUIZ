import { useState, useEffect } from 'react'
import { getNotes, createNote, updateNote, deleteNote } from '../utils/api'

const TAGS = ['All', 'React', 'Frontend', 'Backend', 'Database', 'JavaScript', 'Other']

const tagColors = {
  React: 'bg-blue-900/50 text-blue-300',
  Frontend: 'bg-purple-900/50 text-purple-300',
  Backend: 'bg-green-900/50 text-green-300',
  Database: 'bg-yellow-900/50 text-yellow-300',
  JavaScript: 'bg-orange-900/50 text-orange-300',
  Other: 'bg-gray-700 text-gray-300',
}

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', tag: 'React' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  // Fetch notes on load
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const res = await getNotes()
      setNotes(res.data.notes)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter notes
  const filtered = notes.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    const matchTag = activeTag === 'All' || n.tag === activeTag
    return matchSearch && matchTag
  })

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.content.trim()) e.content = 'Content is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setSaving(true)
    setServerError('')

    try {
      if (editingNote) {
        const res = await updateNote(editingNote._id, form)
        setNotes(notes.map((n) => n._id === editingNote._id ? res.data.note : n))
      } else {
        const res = await createNote(form)
        setNotes([res.data.note, ...notes])
      }
      closeForm()
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setForm({ title: note.title, content: note.content, tag: note.tag })
    setErrors({})
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteNote(id)
      setNotes(notes.filter((n) => n._id !== id))
      setDeleteId(null)
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingNote(null)
    setForm({ title: '', content: '', tag: 'React' })
    setErrors({})
    setServerError('')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-400">My Notes 📝</h1>
          <p className="text-gray-500 text-sm mt-1">{notes.length} notes saved</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingNote(null)
            setForm({ title: '', content: '', tag: 'React' })
          }}
          className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
        >
          + New Note
        </button>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍  Search notes..."
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition mb-4"
      />

      {/* Tag Filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition
              ${activeTag === tag
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="h-4 w-20 bg-gray-700 rounded mb-3" />
              <div className="h-5 w-40 bg-gray-700 rounded mb-2" />
              <div className="h-16 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-lg">No notes found</p>
          <p className="text-sm mt-1">Try a different search or create a new note</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <div
              key={note._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-600 transition group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tagColors[note.tag] || tagColors.Other}`}>
                    {note.tag}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{note.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{note.content}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(note)}
                  className="flex-1 bg-gray-800 hover:bg-indigo-900/40 hover:text-indigo-300 text-gray-400 text-xs py-2 rounded-lg transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setDeleteId(note._id)}
                  className="flex-1 bg-gray-800 hover:bg-red-900/40 hover:text-red-300 text-gray-400 text-xs py-2 rounded-lg transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-indigo-400 mb-6">
              {editingNote ? '✏️ Edit Note' : '➕ New Note'}
            </h2>

            {serverError && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-4">
                {serverError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }) }}
                  placeholder="e.g. React Hooks Summary"
                  className={`w-full bg-gray-800 rounded-lg p-3 text-white outline-none border transition
                    ${errors.title ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'}`}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Tag</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500"
                >
                  {TAGS.filter(t => t !== 'All').map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => { setForm({ ...form, content: e.target.value }); setErrors({ ...errors, content: '' }) }}
                  placeholder="Write your note here..."
                  rows={5}
                  className={`w-full bg-gray-800 rounded-lg p-3 text-white outline-none border transition resize-none
                    ${errors.content ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'}`}
                />
                {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeForm}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
              >
                {saving ? 'Saving...' : editingNote ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <p className="text-4xl mb-4">🗑️</p>
            <h3 className="text-xl font-bold text-white mb-2">Delete Note?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}