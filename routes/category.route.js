const express = require('express')
const router = express.Router()

const categoryController = require('../controllers/category.controller')
const { verifyToken, checkAdmin } = require('../middlewares/auth.middleware')

// Category
router.get('/', categoryController.getAllCategories)
router.get('/:id', categoryController.getCategoryById)
router.post('/', verifyToken, checkAdmin, categoryController.createCategory)
router.put('/:id', verifyToken, checkAdmin, categoryController.updateCategory)
router.delete(
  '/:id',
  verifyToken,
  checkAdmin,
  categoryController.deleteCategory
)

module.exports = router
