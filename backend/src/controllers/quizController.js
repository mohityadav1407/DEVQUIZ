const getQuestions = async (req, res) => {
  res.status(200).json({ message: 'Get questions route working ✅' })
}

const submitScore = async (req, res) => {
  res.status(201).json({ message: 'Submit score route working ✅' })
}

const getScores = async (req, res) => {
  res.status(200).json({ message: 'Get scores route working ✅' })
}

module.exports = { getQuestions, submitScore, getScores }