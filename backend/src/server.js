const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const authRoutes = require('./routes/auth')
const quizRoutes = require('./routes/quiz')
const notesRoutes = require('./routes/notes')
const { errorHandler } = require('./middleware/errorMiddleware')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`)
    next()
  })
}

app.get('/', (req, res) => {
  res.json({ message: '🚀 DevQuiz API is running!', status: 'OK' })
})

app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/notes', notesRoutes)

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected!')
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}

mongoConnect()