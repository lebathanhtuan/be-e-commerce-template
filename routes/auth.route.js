const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

// Auth
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/my-profile', verifyToken, authController.getMyProfile)
router.get('/refresh', verifyToken, authController.refreshAccessToken)
router.put('/change-password', verifyToken, authController.changePassword)

module.exports = router
