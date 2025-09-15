const express = require('express')
const router = express.Router()

const cartController = require('../controllers/cart.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

// Cart
router.get('/', verifyToken, cartController.getCartItems)
router.post('/', verifyToken, cartController.addToCart)
router.put('/:id', verifyToken, cartController.updateCartItem)
router.delete('/:id', verifyToken, cartController.deleteCartItem)

module.exports = router
