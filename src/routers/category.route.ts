import categoryController from '../controllers/category.controller';
import asyncHandler from '@/middleware/asyncHandler';
import { Router } from 'express';

const router = Router();

// Thêm danh mục
router.post('/categories', asyncHandler(categoryController.createCategory));

// Lấy tất cả danh mục
router.get('/categories', asyncHandler(categoryController.getCategories));

// Lấy 1 danh mục theo _id
router.get('/categories/:id', asyncHandler(categoryController.getCategoryById));

// Sửa danh mục
router.put('/categories/:id', asyncHandler(categoryController.updateCategory));

// Xóa danh mục
router.delete('/categories/:id', asyncHandler(categoryController.deleteCategory));

export default router;