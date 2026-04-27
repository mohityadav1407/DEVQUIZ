const Note = require('../models/Note')

// @route  GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ createdAt: -1 })

    res.status(200).json({
      count: notes.length,
      notes
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @route  POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, tag } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      tag: tag || 'General'
    })

    res.status(201).json({
      message: 'Note created successfully!',
      note
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @route  PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this note' })
    }

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content, tag: req.body.tag },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      message: 'Note updated successfully!',
      note: updated
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @route  DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this note' })
    }

    await Note.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Note deleted successfully!' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getNotes, createNote, updateNote, deleteNote }