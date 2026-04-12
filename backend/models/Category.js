const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Category', categorySchema)
