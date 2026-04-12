const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 60,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Subject', subjectSchema)
