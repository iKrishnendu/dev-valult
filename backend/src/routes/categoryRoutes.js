const express = require('express')
const {
  createCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/categoryController')

const router = express.Router()

router.route('/').post(createCategory)
router.route('/:id').put(updateCategory).delete(deleteCategory)

module.exports = router
