const asyncHandler = require('express-async-handler')
const { carts: Carts, products: Products } = require('../models')
const { BadRequestError, NotFoundError } = require('../utils/ApiError')

const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const cartItems = await Carts.findAll({
    where: { userId },
    include: [{ model: Products, as: 'product' }],
  })

  res.status(200).json({
    message: 'Lấy danh sách giỏ hàng thành công.',
    data: cartItems,
  })
})

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { productId, quantity = 1 } = req.body

  const product = await Products.findByPk(productId)
  if (!product) {
    throw new NotFoundError('Không tìm thấy sản phẩm')
  }

  let cartItem = await Carts.findOne({
    where: { userId, productId },
  })

  if (cartItem) {
    cartItem.quantity += quantity
    await cartItem.save()
  } else {
    cartItem = await Carts.create({
      userId,
      productId,
      quantity,
    })
  }

  res.status(200).json({
    message: 'Đã thêm sản phẩm vào giỏ hàng thành công.',
    data: cartItem,
  })
})

const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { id } = req.params
  const { quantity } = req.body

  if (quantity < 1) {
    throw new BadRequestError('Số lượng phải lớn hơn 0')
  }

  const cartItem = await Carts.findOne({
    where: { id, userId },
  })
  if (!cartItem) {
    throw new NotFoundError('Không tìm thấy sản phẩm trong giỏ hàng')
  }

  cartItem.quantity = quantity
  await cartItem.save()

  res.status(200).json({
    message: 'Cập nhật giỏ hàng thành công.',
    data: cartItem,
  })
})

const deleteCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { id } = req.params

  const cartItem = await Carts.findOne({
    where: { id, userId },
  })
  if (!cartItem) {
    throw new NotFoundError('Không tìm thấy sản phẩm trong giỏ hàng')
  }

  await cartItem.destroy()

  res.status(200).json({
    message: 'Xóa sản phẩm khỏi giỏ hàng thành công.',
  })
})

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
}
