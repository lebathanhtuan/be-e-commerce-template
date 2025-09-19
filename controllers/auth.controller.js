const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const { users: Users } = require('../models')

const {
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} = require('../utils/ApiError')

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await Users.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  })

  res.status(201).json(newUser)
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await Users.findOne({ where: { email: email } })
  console.log('🚀 ~ user:', user)
  if (!user) {
    throw new BadRequestError('Email hoặc mật khẩu không đúng!')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  console.log('🚀 ~ isMatch:', isMatch)
  if (!isMatch) {
    throw new BadRequestError('Email hoặc mật khẩu không đúng!')
  }
  const tokenPayload = { id: user.id, email: user.email, role: user.role }
  const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
  const refreshToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  await user.update({ refreshToken })

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken: accessToken,
    refreshToken: refreshToken,
  })
})

const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const user = await Users.findByPk(userId, {
    attributes: { exclude: ['password'] }, // Exclude password from response
  })
  res.status(200).json(user)
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { token } = req.body
  if (!token) {
    throw new UnauthorizedError()
  }

  try {
    const user = await Users.findOne({ where: { refreshToken: token } })
    if (!user) {
      throw new ForbiddenError()
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded.id !== user.id) {
        throw new ForbiddenError()
      }

      const accessTokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      }
      const newAccessToken = jwt.sign(
        accessTokenPayload,
        process.env.JWT_SECRET,
        {
          expiresIn: '24h',
        }
      )

      res.status(200).json({ accessToken: newAccessToken })
    })
  } catch (error) {
    throw new ForbiddenError()
  }
})

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { oldPassword, newPassword } = req.body

  const user = await Users.findByPk(userId)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password)
  if (!isMatch) {
    throw new BadRequestError('Old password is incorrect')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  user.password = hashedPassword
  await user.save()

  res.status(200).json({ message: 'Password changed successfully' })
})

module.exports = {
  register,
  login,
  getMyProfile,
  refreshAccessToken,
  changePassword,
}
