import productController from '../controllers/product.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
import { ProductValidation } from '@/validation/product.validation'
import { Router } from 'express'

const router = Router()

router.get('/', asyncHandler(productController.getProducts))
router.get('/:id', asyncHandler(productController.getProductById))
router.post(
  '/',
  verifyJWT,
  validationRequest(ProductValidation.createProduct()),
  asyncHandler(productController.createProduct)
)
router.put(
  '/:id',
  verifyJWT,
  validationRequest(ProductValidation.updateProduct()),
  asyncHandler(productController.updateProduct)
)
router.delete('/:id', verifyJWT, asyncHandler(productController.deleteProduct))

export default router
