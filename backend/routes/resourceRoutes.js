const express = require('express')
const {
  createResource,
  deleteResource,
  updateResource,
} = require('../controllers/resourceController')

const router = express.Router()

router.route('/').post(createResource)
router.route('/:id').put(updateResource).delete(deleteResource)

module.exports = router
