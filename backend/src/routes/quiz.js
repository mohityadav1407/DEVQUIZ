const express = require('express')
const router = express.Router()
const { getQuestions, submitScore, getScores } = require('../controllers/quizController')
const { protect } = require('../middleware/authMiddleware')

router.get('/questions', protect, getQuestions)
router.post('/submit', protect, submitScore)
router.get('/scores', protect, getScores)

module.exports = router