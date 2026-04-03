const getNotes = async (req, res) => {
  res.status(200).json({ message: 'Get notes route working ✅' })
}

const createNote = async (req, res) => {
  res.status(201).json({ message: 'Create note route working ✅' })
}

const updateNote = async (req, res) => {
  res.status(200).json({ message: 'Update note route working ✅' })
}

const deleteNote = async (req, res) => {
  res.status(200).json({ message: 'Delete note route working ✅' })
}

module.exports = { getNotes, createNote, updateNote, deleteNote }