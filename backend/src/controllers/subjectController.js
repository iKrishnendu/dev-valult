const Category = require('../models/Category')
const Resource = require('../models/Resource')
const Subject = require('../models/Subject')
const asyncHandler = require('../utils/asyncHandler')
const ensureObjectId = require('../utils/objectId')
const getSubjectTree = require('../utils/subjectTree')

const createSubject = asyncHandler(async (req, res) => {
  const { name } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Subject name is required.' })
  }

  const subject = await Subject.create({ name: name.trim() })
  const payload = await getSubjectTree(subject)

  res.status(201).json(payload)
})

const getSubjects = asyncHandler(async (_req, res) => {
  const subjects = await Subject.find().sort({ createdAt: 1 })
  const payload = await Promise.all(
    subjects.map(async (subject) => {
      const categories = await Category.find({ subjectId: subject._id }).lean()
      const categoryIds = categories.map((category) => category._id)
      const resources = await Resource.find({ categoryId: { $in: categoryIds } }).lean()

      return {
        _id: subject._id,
        name: subject.name,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
        stats: {
          categoryCount: categories.length,
          resourceCount: resources.length,
          bookmarkCount: resources.filter((resource) => resource.isBookmarked).length,
        },
      }
    }),
  )

  res.json(payload)
})

const getSubjectById = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, 'subject id')
  const subject = await Subject.findById(req.params.id).lean()

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found.' })
  }

  const payload = await getSubjectTree(subject)
  res.json(payload)
})

const updateSubject = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, 'subject id')
  const { name } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ message: 'Subject name is required.' })
  }

  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    { name: name.trim() },
    { new: true, runValidators: true },
  )

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found.' })
  }

  const payload = await getSubjectTree(subject)
  res.json(payload)
})

const deleteSubject = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, 'subject id')
  const subject = await Subject.findById(req.params.id)

  if (!subject) {
    return res.status(404).json({ message: 'Subject not found.' })
  }

  const categories = await Category.find({ subjectId: subject._id }).lean()
  const categoryIds = categories.map((category) => category._id)

  await Resource.deleteMany({ categoryId: { $in: categoryIds } })
  await Category.deleteMany({ subjectId: subject._id })
  await subject.deleteOne()

  res.json({ message: 'Subject deleted successfully.' })
})

module.exports = {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
}
