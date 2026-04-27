const Quiz = require('../models/Quiz')
const Score = require('../models/Score')

// @route  GET /api/quiz/questions
const getQuestions = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}

    // ✅ Include answer now so frontend can compare
    const questions = await Quiz.find(filter)
      .sort({ category: 1 })

    res.status(200).json({
      count: questions.length,
      questions
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
// @route  POST /api/quiz/submit
const submitScore = async (req, res) => {
  try {
    const { score, total, category } = req.body

    if (score === undefined || !total) {
      return res.status(400).json({ message: 'Score and total are required' })
    }

    const newScore = await Score.create({
      user: req.user.id,
      score,
      total,
      category: category || 'General',
    })

    res.status(201).json({
      message: 'Score saved successfully!',
      score: newScore,
      percentage: newScore.percentage
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @route  GET /api/quiz/scores
const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    const totalQuizzes = scores.length
    const avgScore = totalQuizzes > 0
      ? Math.round(
          scores.reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes
        )
      : 0

    res.status(200).json({
      scores,
      stats: {
        totalQuizzes,
        avgScore: `${avgScore}%`
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @route  GET /api/quiz/stats
const getStats = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.id })
    const notes = await (require('../models/Note')).countDocuments({ user: req.user.id })

    const totalQuizzes = scores.length
    const avgScore = totalQuizzes > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes)
      : 0

    // Best score per category
    const categories = ['Frontend', 'Backend', 'React', 'JavaScript', 'Database']
    const categoryStats = {}

    categories.forEach(cat => {
      const catScores = scores.filter(s => s.category === cat)
      categoryStats[cat] = catScores.length > 0
        ? Math.round(catScores.reduce((sum, s) => sum + s.percentage, 0) / catScores.length)
        : 0
    })

    // Recent activity
    const recentScores = await Score.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(200).json({
      stats: {
        totalQuizzes,
        avgScore,
        totalNotes: notes,
        categoryStats,
      },
      recentActivity: recentScores
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getQuestions, submitScore, getScores, getStats }