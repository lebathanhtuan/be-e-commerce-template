var DataTypes = require('sequelize').DataTypes
var _carts = require('./carts')
var _categories = require('./categories')
var _favorites = require('./favorites')
var _order_items = require('./order_items')
var _orders = require('./orders')
var _products = require('./products')
var _reviews = require('./reviews')
var _users = require('./users')

function initModels(sequelize) {
  var carts = _carts(sequelize, DataTypes)
  var categories = _categories(sequelize, DataTypes)
  var favorites = _favorites(sequelize, DataTypes)
  var order_items = _order_items(sequelize, DataTypes)
  var orders = _orders(sequelize, DataTypes)
  var products = _products(sequelize, DataTypes)
  var reviews = _reviews(sequelize, DataTypes)
  var users = _users(sequelize, DataTypes)

  products.belongsTo(categories, { as: 'category', foreignKey: 'categoryId' })
  categories.hasMany(products, { as: 'products', foreignKey: 'categoryId' })
  order_items.belongsTo(orders, { as: 'order', foreignKey: 'orderId' })
  orders.hasMany(order_items, { as: 'order_items', foreignKey: 'orderId' })
  carts.belongsTo(products, { as: 'product', foreignKey: 'productId' })
  products.hasMany(carts, { as: 'carts', foreignKey: 'productId' })
  favorites.belongsTo(products, { as: 'product', foreignKey: 'productId' })
  products.hasMany(favorites, { as: 'favorites', foreignKey: 'productId' })
  order_items.belongsTo(products, { as: 'product', foreignKey: 'productId' })
  products.hasMany(order_items, { as: 'order_items', foreignKey: 'productId' })
  reviews.belongsTo(products, { as: 'product', foreignKey: 'productId' })
  products.hasMany(reviews, { as: 'reviews', foreignKey: 'productId' })
  carts.belongsTo(users, { as: 'user', foreignKey: 'userId' })
  users.hasMany(carts, { as: 'carts', foreignKey: 'userId' })
  favorites.belongsTo(users, { as: 'user', foreignKey: 'userId' })
  users.hasMany(favorites, { as: 'favorites', foreignKey: 'userId' })
  orders.belongsTo(users, { as: 'user', foreignKey: 'userId' })
  users.hasMany(orders, { as: 'orders', foreignKey: 'userId' })
  reviews.belongsTo(users, { as: 'user', foreignKey: 'userId' })
  users.hasMany(reviews, { as: 'reviews', foreignKey: 'userId' })

  return {
    carts,
    categories,
    favorites,
    order_items,
    orders,
    products,
    reviews,
    users,
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
