import { useState, useEffect } from 'react'
import { getQuestions, submitScore } from '../utils/api'

const TIME_PER_QUESTION = 20

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [quizFinished, setQuizFinished] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [quizStarted, setQuizStarted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const CATEGORIES = ['All', 'Frontend', 'JavaScript', 'React', 'Backend', 'Database']

  const fetchQuestions = async (cat) => {
    setLoading(true)
    setError('')
    try {
      const res = await getQuestions(cat === 'All' ? '' : cat)
      const fetched = res.data.questions

      if (!fetched || fetched.length === 0) {
        setError('No questions found for this category.')
        setLoading(false)
        return
      }

      // ✅ Shuffle questions
      const shuffled = [...fetched].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
    } catch (err) {
      setError('Failed to load questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions('All')
  }, [])

  const currentQuestion = questions[currentIndex]

  // ⏱️ Timer
  useEffect(() => {
    if (!quizStarted || quizFinished || showFeedback) return
    if (timeLeft === 0) {
      handleTimeOut()
      return
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, quizFinished, showFeedback, quizStarted])

  // Reset on new question
  useEffect(() => {
    if (!quizStarted) return
    setTimeLeft(TIME_PER_QUESTION)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }, [currentIndex])

  const handleTimeOut = () => {
    // ✅ Record unanswered question
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: 'No answer',
        correct: currentQuestion.answer,
        isCorrect: false
      }
    ])
    goToNext()
  }

  const handleAnswer = (option) => {
    if (selectedAnswer !== null || showFeedback) return

    // ✅ Correct comparison — both are strings from DB
    const correctAnswer = currentQuestion.answer
    const isCorrect = option.trim() === correctAnswer.trim()

    console.log('Selected:', option)
    console.log('Correct:', correctAnswer)
    console.log('Is Correct:', isCorrect)

    setSelectedAnswer(option)
    setShowFeedback(true)

    if (isCorrect) setScore((s) => s + 1)

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: option,
        correct: correctAnswer,
        isCorrect
      }
    ])

    setTimeout(() => goToNext(), 1500)
  }

  const goToNext = () => {
    if (currentIndex + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const finishQuiz = async () => {
    setQuizFinished(true)
    setSubmitting(true)
    try {
      await submitScore({
        score,
        total: questions.length,
        category: category === 'All' ? 'General' : category
      })
    } catch (err) {
      console.error('Failed to save score:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const startQuiz = async () => {
    setQuizStarted(false)
    setCurrentIndex(0)
    setScore(0)
    setAnswers([])
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizFinished(false)
    await fetchQuestions(category)
    setQuizStarted(true)
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setTimeLeft(TIME_PER_QUESTION)
    setQuizFinished(false)
    setAnswers([])
    setShowFeedback(false)
    setQuizStarted(false)
  }

  const getOptionStyle = (option) => {
    if (!showFeedback) {
      return 'border-gray-700 bg-gray-800 hover:border-indigo-500 hover:bg-gray-750 cursor-pointer'
    }
    if (option.trim() === currentQuestion.answer.trim()) {
      return 'border-green-500 bg-green-900/40 cursor-default'
    }
    if (option === selectedAnswer) {
      return 'border-red-500 bg-red-900/40 cursor-default'
    }
    return 'border-gray-700 bg-gray-800 opacity-40 cursor-default'
  }

  const percentage = questions.length > 0
    ? Math.round((score / questions.length) * 100)
    : 0

  const progress = questions.length > 0
    ? (currentIndex / questions.length) * 100
    : 0

  // ── Loading ────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[88vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading questions...</p>
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[88vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchQuestions('All')}
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg transition text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ── Category Selection ─────────────────────────
  if (!quizStarted) {
    return (
      <div className="flex justify-center items-center min-h-[88vh] px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-indigo-400 mb-2">Start Quiz 🧠</h2>
          <p className="text-gray-400 text-sm mb-8">
            Choose a category or take all questions
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-3 rounded-xl border text-sm font-medium transition
                  ${category === cat
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-4 mb-6 text-left text-sm text-gray-400 space-y-2">
            <p>📋 {questions.length} questions available</p>
            <p>⏱ {TIME_PER_QUESTION} seconds per question</p>
            <p>🎯 Score saved automatically</p>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-xl font-semibold text-white"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    )
  }

  // ── Results Screen ─────────────────────────────
  if (quizFinished) {
    return (
      <div className="flex justify-center items-center min-h-[88vh] px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-indigo-400 mb-2">
              Quiz Complete!
            </h2>
            {submitting
              ? <p className="text-gray-400 text-sm">Saving score...</p>
              : <p className="text-green-400 text-sm">Score saved! ✅</p>
            }
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Score</p>
              <p className="text-2xl font-bold text-white">
                {score}/{questions.length}
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Percentage</p>
              <p className={`text-2xl font-bold
                ${percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {percentage}%
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Category</p>
              <p className="text-lg font-bold text-indigo-400">
                {category || 'All'}
              </p>
            </div>
          </div>

          {/* Answer Review */}
          <div className="space-y-3 mb-8 max-h-72 overflow-y-auto pr-1">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border text-sm
                  ${a.isCorrect
                    ? 'border-green-800 bg-green-900/20'
                    : 'border-red-800 bg-red-900/20'}`}
              >
                <span className="mt-0.5 text-base">
                  {a.isCorrect ? '✅' : '❌'}
                </span>
                <div className="flex-1">
                  <p className="text-gray-300 font-medium">{a.question}</p>
                  {!a.isCorrect && (
                    <>
                      <p className="text-red-400 text-xs mt-1">
                        Your answer: {a.selected}
                      </p>
                      <p className="text-green-400 text-xs mt-0.5">
                        Correct: {a.correct}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={restartQuiz}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-xl font-semibold text-white"
          >
            Try Again 🔄
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz Screen ────────────────────────────────
  return (
    <div className="flex justify-center items-center min-h-[88vh] px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            Question{' '}
            <span className="text-white font-semibold">{currentIndex + 1}</span>
            {' '}of {questions.length}
          </span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full transition
            ${timeLeft <= 5
              ? 'bg-red-900/50 text-red-400 animate-pulse'
              : 'bg-gray-800 text-indigo-400'}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-gray-800 rounded-full h-1 mb-8">
          <div
            className={`h-1 rounded-full transition-all duration-1000
              ${timeLeft <= 5 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
          />
        </div>

        {/* Category Badge */}
        <span className="text-xs bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full mb-4 inline-block">
          {currentQuestion?.category}
        </span>

        {/* Question */}
        <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
          {currentQuestion?.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm text-white ${getOptionStyle(option)}`}
            >
              <span className="text-gray-500 mr-3 font-mono">
                {['A', 'B', 'C', 'D'][i]}.
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Score */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
          <span>Category: <span className="text-gray-400">{currentQuestion?.category}</span></span>
          <span>Score: <span className="text-indigo-400 font-semibold">{score}</span></span>
        </div>

      </div>
    </div>
  )
}