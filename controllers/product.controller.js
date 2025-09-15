const path = require('path')
const { Op } = require('sequelize')
const asyncHandler = require('express-async-handler')

const { NotFoundError } = require('../utils/ApiError')
const { products: Products, categories: Categories } = require('../models')

const getProductList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'id', order = 'asc', q } = req.query
  const categoryIds = req.query['categoryIds[]']
  const offset = (page - 1) * limit

  let whereClause = {}
  if (categoryIds) {
    whereClause.categoryId = {
      [Op.in]: Array.isArray(categoryIds) ? categoryIds : [categoryIds],
    }
  }

  if (q) {
    whereClause.name = { [Op.like]: `%${q}%` }
  }

  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
  const sortColumn = ['id', 'name', 'price'].includes(sort) ? sort : 'id'

  const result = await Products.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Categories,
        as: 'category',
        attributes: ['id', 'name'],
      },
    ],
    // [['name', 'asc'], ['price', 'desc']] // Example of multiple sorting
    order: [[sortColumn, sortOrder]],
    limit: parseInt(limit),
    offset: parseInt(offset),
  })

  const totalPages = Math.ceil(result.count / limit)

  res.json({
    data: result.rows,
    meta: {
      total: result.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: totalPages,
    },
  })
})

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const result = await Products.findByPk(id, {
    include: [
      {
        model: Categories,
        as: 'category',
        attributes: ['id', 'name'],
      },
    ],
  })
  if (!result) {
    throw new NotFoundError('Không tìm thấy sản phẩm')
  }
  res.json(result)
})

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, categoryId } = req.body

  let imagePath = null
  if (req.file) {
    imagePath = req.file.path
  }

  const newProduct = await Products.create({
    name,
    price,
    categoryId,
    image: imagePath,
  })

  res.status(201).json(newProduct)
})

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, price, categoryId } = req.body

  const product = await Products.findByPk(id)
  if (!product) {
    throw new NotFoundError('Không tìm thấy sản phẩm')
  }

  product.name = name
  product.price = price
  product.category_id = categoryId
  await product.save()
  res.json(product)
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params

  const product = await Products.findByPk(id)
  if (!product) {
    throw new NotFoundError('Không tìm thấy sản phẩm')
  }

  await product.destroy()
  res.json({ message: 'Xóa sản phẩm thành công' })
})

module.exports = {
  getProductList,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
