const jwt = require('jsonwebtoken')
const { UnauthorizedError, ForbiddenError } = require('../utils/ApiError')

const verifyToken = (req, res, next) => {
  // Authorization: 'Bearer <token>' -> ['Bearer', '<token>']
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    throw new UnauthorizedError('No token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // -> { id, email, role }
    req.user = decoded
    next()
  } catch (error) {
    throw new UnauthorizedError('Invalid token')
  }
}

const checkAdmin = (req, res, next) => {
  const userRole = req.user.role

  if (userRole === 'admin') {
    next()
  } else {
    throw new ForbiddenError(
      'You do not have permission to access this resource'
    )
  }
}

module.exports = { verifyToken, checkAdmin }
