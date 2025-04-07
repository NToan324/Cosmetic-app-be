import brandController from '../controllers/brand.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import { BrandValidation } from '@/validation/brand.validation'
import { Router } from 'express'

const router = Router()

router.post('/', validationRequest(BrandValidation.createBrand()), asyncHandler(brandController.createBrand))

router.get('/', asyncHandler(brandController.getBrands))

router.get('/:id', asyncHandler(brandController.getBrandById))

router.put('/:id', validationRequest(BrandValidation.updateBrand()), asyncHandler(brandController.updateBrand))

router.delete('/:id', asyncHandler(brandController.deleteBrand))

export default router
