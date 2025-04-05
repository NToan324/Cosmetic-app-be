import { Router } from 'express'
import AuthController from '@/controllers/auth.controller'
import asyncHandler from '@/middleware/asyncHandler'
import userValidation from '@/validation/user.validation'
import { validationRequest } from '@/middleware/validationRequest'
const router = Router()

router.post('/signup', validationRequest(userValidation.signupSchema()), asyncHandler(AuthController.signup))
router.delete('/:id', asyncHandler(AuthController.deleteUser))
router.get('/:id', asyncHandler(AuthController.getUser))
router.post('/login', asyncHandler(AuthController.login))

export default router
