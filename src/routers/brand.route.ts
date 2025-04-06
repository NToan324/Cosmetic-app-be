import brandController from '../controllers/brand.controller';
import asyncHandler from '@/middleware/asyncHandler';
import { Router } from 'express';

const router = Router();

// Thêm thương hiệu
router.post('/brands', asyncHandler(brandController.createBrand));

// Lấy tất cả thương hiệu
router.get('/brands', asyncHandler(brandController.getBrands));

// Lấy 1 thương hiệu theo _id
router.get('/brands/:id', asyncHandler(brandController.getBrandById));

// Sửa thương hiệu
router.put('/brands/:id', asyncHandler(brandController.updateBrand));

// Xóa thương hiệu
router.delete('/brands/:id', asyncHandler(brandController.deleteBrand));

export default router;