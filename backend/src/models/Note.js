const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    tag: {
      type: String,
      default: 'General',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Note', noteSchema)