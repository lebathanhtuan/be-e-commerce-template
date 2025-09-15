const express = require('express')
const router = express.Router()

const addressController = require('../controllers/address.controller')

// Address
router.get('/cities', addressController.getALlCities)
router.get('/districts', addressController.getDistrictsByCityCode)
router.get('/wards', addressController.getWardsByDistrictCode)

module.exports = router
