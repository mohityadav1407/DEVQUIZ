const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const authRoutes = require('./routes/auth')
const quizRoutes = require('./routes/quiz')
const notesRoutes = require('./routes/notes')
const { errorHandler } = require('./middleware/errorMiddleware')

const app = express()

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Request Logger (dev only) ───────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`)
    next()
  })
}

// ── Health Check ────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 DevQuiz API is running!', status: 'OK' })
})

// ── Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/notes', notesRoutes)

// ── 404 Handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
})

// ── Global Error Handler ─────────────────────────────
app.use(errorHandler)

// ── Start Server ─────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})