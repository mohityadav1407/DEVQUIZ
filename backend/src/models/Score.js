const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 1,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'React', 'JavaScript', 'Database', 'General'],
      default: 'General',
    },
  },
  { timestamps: true }
)

// Auto calculate percentage before saving
scoreSchema.pre('save', function (next) {
  this.percentage = Math.round((this.score / this.total) * 100)
  next()
})

module.exports = mongoose.model('Score', scoreSchema)