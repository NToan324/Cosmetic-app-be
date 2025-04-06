import productController from '../controllers/product.controller';
import asyncHandler from '@/middleware/asyncHandler';
import { Router } from 'express';

const router = Router();

// Route để thêm sản phẩm
router.post('/', asyncHandler(productController.createProduct));

// Route để lấy danh sách sản phẩm
router.get('/', asyncHandler(productController.getProducts));

// Route để lấy 1 sản phẩm
router.get('/:id', asyncHandler(productController.getProductById));

// Route để xóa sản phẩm
router.delete('/:id', asyncHandler(productController.deleteProduct));

export default router;