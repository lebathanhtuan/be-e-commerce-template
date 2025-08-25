const express = require('express')
const router = express.Router()

const productController = require('../controllers/product.controller')
const { verifyToken, checkAdmin } = require('../middlewares/auth.middleware')
const { productUploads } = require('../middlewares/upload.middleware')

// Products
router.get('/', productController.getProductList)
router.get('/:id', productController.getProductById)
router.post(
  '/',
  verifyToken,
  checkAdmin,
  productUploads.single('image'),
  productController.createProduct
)
router.put(
  '/:id',
  verifyToken,
  checkAdmin,
  productUploads.single('image'),
  productController.updateProduct
)
router.delete('/:id', verifyToken, checkAdmin, productController.deleteProduct)

module.exports = router
