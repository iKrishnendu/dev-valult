const mongoose = require('mongoose')

const ensureObjectId = (value, label = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${label}`)
    error.statusCode = 400
    throw error
  }
}

module.exports = ensureObjectId
