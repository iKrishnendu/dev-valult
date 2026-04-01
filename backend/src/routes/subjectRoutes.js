const express = require('express')
const {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} = require('../controllers/subjectController')

const router = express.Router()

router.route('/').get(getSubjects).post(createSubject)
router.route('/:id').get(getSubjectById).put(updateSubject).delete(deleteSubject)

module.exports = router
