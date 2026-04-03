import { useState, useEffect } from 'react'
import questions from '../data/questions'

const TIME_PER_QUESTION = 20

export default function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [quizFinished, setQuizFinished] = useState(false)
  const [answers, setAnswers] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestion = questions[currentIndex]

  // ⏱️ Timer logic
  useEffect(() => {
    if (quizFinished || showFeedback) return

    if (timeLeft === 0) {
      handleNext(null) // auto-move if time runs out
      return
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, quizFinished, showFeedback])

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(TIME_PER_QUESTION)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }, [currentIndex])

  const handleAnswer = (option) => {
    if (selectedAnswer || showFeedback) return
    setSelectedAnswer(option)
    setShowFeedback(true)

    const isCorrect = option === currentQuestion.answer
    if (isCorrect) setScore((s) => s + 1)

    setAnswers((prev) => [
      ...prev,
      { question: currentQuestion.question, selected: option, correct: currentQuestion.answer, isCorrect }
    ])

    setTimeout(() => handleNext(option), 1200)
  }

  const handleNext = (option) => {
    if (currentIndex + 1 >= questions.length) {
      setQuizFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setTimeLeft(TIME_PER_QUESTION)
    setQuizFinished(false)
    setAnswers([])
    setShowFeedback(false)
  }

  const percentage = Math.round((score / questions.length) * 100)
  const progress = ((currentIndex) / questions.length) * 100

  // 🎉 Results Screen
  if (quizFinished) {
    return (
      <div className="flex justify-center items-center min-h-[88vh] px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-indigo-400 mb-2">Quiz Complete!</h2>
            <p className="text-gray-400">Here's how you did</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Score</p>
              <p className="text-2xl font-bold text-white">{score}/{questions.length}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Percentage</p>
              <p className={`text-2xl font-bold ${percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {percentage}%
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Correct</p>
              <p className="text-2xl font-bold text-green-400">{score}</p>
            </div>
          </div>

          {/* Answer Review */}
          <div className="space-y-3 mb-8 max-h-64 overflow-y-auto pr-1">
            {answers.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm
                ${a.isCorrect ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'}`}>
                <span className="mt-0.5">{a.isCorrect ? '✅' : '❌'}</span>
                <div>
                  <p className="text-gray-300 font-medium">{a.question}</p>
                  {!a.isCorrect && (
                    <p className="text-green-400 text-xs mt-1">Correct: {a.correct}</p>
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

  // 🧠 Quiz Screen
  return (
    <div className="flex justify-center items-center min-h-[88vh] px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            Question <span className="text-white font-semibold">{currentIndex + 1}</span> of {questions.length}
          </span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full
            ${timeLeft <= 5 ? 'bg-red-900/50 text-red-400 animate-pulse' : 'bg-gray-800 text-indigo-400'}`}>
            ⏱ {timeLeft}s
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-gray-800 rounded-full h-1 mb-8">
          <div
            className={`h-1 rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
          />
        </div>

        {/* Category Badge */}
        <span className="text-xs bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full mb-4 inline-block">
          {currentQuestion.category}
        </span>

        {/* Question */}
        <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, i) => {
            let style = 'border-gray-700 bg-gray-800 hover:border-indigo-500 hover:bg-gray-750 cursor-pointer'

            if (showFeedback) {
              if (option === currentQuestion.answer) {
                style = 'border-green-500 bg-green-900/30 cursor-default'
              } else if (option === selectedAnswer && option !== currentQuestion.answer) {
                style = 'border-red-500 bg-red-900/30 cursor-default'
              } else {
                style = 'border-gray-700 bg-gray-800 opacity-50 cursor-default'
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm text-white ${style}`}
              >
                <span className="text-gray-500 mr-3 font-mono">
                  {['A', 'B', 'C', 'D'][i]}.
                </span>
                {option}
              </button>
            )
          })}
        </div>

        {/* Score */}
        <div className="mt-6 text-right text-sm text-gray-500">
          Score: <span className="text-indigo-400 font-semibold">{score}</span>
        </div>
      </div>
    </div>
  )
}