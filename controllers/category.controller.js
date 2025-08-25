const path = require('path')
const asyncHandler = require('express-async-handler')
const { NotFoundError } = require('../utils/ApiError')

const { categories: Categories } = require('../models')

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Categories.findAll()
  res.json(categories)
})

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const category = await Categories.findByPk(id)
  if (!category) {
    throw new NotFoundError('Không tìm thấy danh mục')
  }
  res.json(category)
})

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  const newCategory = await Categories.create({ name, description })
  res.status(201).json(newCategory)
})

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body

  const category = await Categories.findByPk(id)
  if (!category) {
    throw new NotFoundError('Không tìm thấy danh mục')
  }

  category.name = name
  category.description = description
  await category.save()
  res.json(category)
})

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params

  const category = await Categories.findByPk(id)
  if (!category) {
    throw new NotFoundError('Không tìm thấy danh mục')
  }

  await category.destroy()
  res.json({ message: 'Xóa danh mục thành công' })
})

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
