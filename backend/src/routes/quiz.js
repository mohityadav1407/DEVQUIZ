const express = require('express')
const router = express.Router()
const {
  getQuestions,
  submitScore,
  getScores,
  getStats
} = require('../controllers/quizController')
const { protect } = require('../middleware/authMiddleware')

router.get('/questions', protect, getQuestions)
router.post('/submit', protect, submitScore)
router.get('/scores', protect, getScores)
router.get('/stats', protect, getStats)

module.exports = router