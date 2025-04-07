import brandController from '../controllers/brand.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import { BrandValidation } from '@/validation/brand.validation'
import { Router } from 'express'

const router = Router()

// Thêm thương hiệu
router.post('/', validationRequest(BrandValidation.createBrand()), asyncHandler(brandController.createBrand))

// Lấy tất cả thương hiệu
router.get('/', asyncHandler(brandController.getBrands))

// Lấy 1 thương hiệu theo _id
router.get('/:id', asyncHandler(brandController.getBrandById))

// Sửa thương hiệu
router.put('/:id', validationRequest(BrandValidation.updateBrand()), asyncHandler(brandController.updateBrand))

// Xóa thương hiệu
router.delete('/:id', asyncHandler(brandController.deleteBrand))

export default router
