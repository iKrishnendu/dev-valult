const Category = require('../models/Category')
const Resource = require('../models/Resource')

const getSubjectTree = async (subject) => {
  const categories = await Category.find({ subjectId: subject._id })
    .sort({ createdAt: 1 })
    .lean()

  const categoryIds = categories.map((category) => category._id)
  const resources = await Resource.find({ categoryId: { $in: categoryIds } })
    .sort({ createdAt: -1 })
    .lean()

  const resourcesByCategory = resources.reduce((acc, resource) => {
    const key = String(resource.categoryId)
    acc[key] ??= []
    acc[key].push(resource)
    return acc
  }, {})

  return {
    ...subject.toObject(),
    categories: categories.map((category) => ({
      ...category,
      resources: resourcesByCategory[String(category._id)] ?? [],
    })),
    stats: {
      categoryCount: categories.length,
      resourceCount: resources.length,
      bookmarkCount: resources.filter((resource) => resource.isBookmarked).length,
    },
  }
}

module.exports = getSubjectTree
