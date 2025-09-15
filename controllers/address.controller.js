const fs = require('fs/promises')
const path = require('path')
const asyncHandler = require('express-async-handler')
const { BadRequestError, NotFoundError } = require('../utils/ApiError')

const dataPath = path.join(__dirname, '..', 'data')

const getALlCities = asyncHandler(async (req, res) => {
  const citiesPath = path.join(dataPath, 'cities.json')
  const data = await fs.readFile(citiesPath, 'utf-8')
  const cities = JSON.parse(data)
  res.json(cities)
})

const getDistrictsByCityCode = asyncHandler(async (req, res) => {
  const { cityCode } = req.body
  if (!cityCode) {
    throw new BadRequestError('City code is required')
  }
  const districtsPath = path.join(dataPath, 'district.json')
  const data = await fs.readFile(districtsPath, 'utf-8')
  const districts = JSON.parse(data)
  const filteredDistricts = districts.filter(
    (district) => district.parentcode === cityCode
  )
  res.json(filteredDistricts)
})

const getWardsByDistrictCode = asyncHandler(async (req, res) => {
  const { districtCode } = req.body
  if (!districtCode) {
    throw new BadRequestError('District code is required')
  }
  const wardsPath = path.join(dataPath, 'ward.json')
  const data = await fs.readFile(wardsPath, 'utf-8')
  const wards = JSON.parse(data)
  const filteredWards = wards.filter((ward) => ward.parentcode === districtCode)
  res.json(filteredWards)
})

module.exports = {
  getALlCities,
  getDistrictsByCityCode,
  getWardsByDistrictCode,
}
