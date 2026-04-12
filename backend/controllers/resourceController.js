const Category = require("../models/Category");
const Resource = require("../models/Resource");
const asyncHandler = require("../utils/asyncHandler");
const ensureObjectId = require("../utils/objectId");

const createResource = asyncHandler(async (req, res) => {
  const { title, url, type, categoryId, isBookmarked } = req.body;

  if (!title?.trim() || !url?.trim() || !type || !categoryId) {
    return res.status(400).json({
      message: "Resource title, url, type, and category are required.",
    });
  }

  ensureObjectId(categoryId, "category id");
  const category = await Category.findById(categoryId);

  if (!category) {
    return res.status(404).json({ message: "Category not found." });
  }

  const resource = await Resource.create({
    title: title.trim(),
    url: url.trim(),
    type,
    categoryId,
    isBookmarked: Boolean(isBookmarked),
  });

  res.status(201).json(resource);
});

const updateResource = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "resource id");
  const { title, url, type, categoryId, isBookmarked } = req.body;

  const nextValues = {};

  if (title !== undefined) nextValues.title = title.trim();
  if (url !== undefined) nextValues.url = url.trim();
  if (type !== undefined) nextValues.type = type;
  if (isBookmarked !== undefined)
    nextValues.isBookmarked = Boolean(isBookmarked);

  if (categoryId !== undefined) {
    ensureObjectId(categoryId, "category id");
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    nextValues.categoryId = categoryId;
  }

  const resource = await Resource.findByIdAndUpdate(req.params.id, nextValues, {
    new: true,
    runValidators: true,
  });

  if (!resource) {
    return res.status(404).json({ message: "Resource not found." });
  }

  res.json(resource);
});

const deleteResource = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "resource id");
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return res.status(404).json({ message: "Resource not found." });
  }

  await resource.deleteOne();
  res.json({ message: "Resource deleted successfully." });
});

module.exports = {
  createResource,
  deleteResource,
  updateResource,
};
