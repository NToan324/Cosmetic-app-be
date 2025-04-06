import { Router } from 'express'
import AuthController from '@/controllers/auth.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { AuthValidation } from '@/validation/auth.validation'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
const router = Router()

router.post('/signup', validationRequest(AuthValidation.signupSchema()), asyncHandler(AuthController.signup))
router.post('/login', validationRequest(AuthValidation.loginSchema()), asyncHandler(AuthController.login))
router.delete('/:id', asyncHandler(AuthController.deleteUser))
router.post('/tokens', AuthController.refreshToken)
router.get('/me', verifyJWT, asyncHandler(AuthController.getMe))
router.get('/:id', asyncHandler(AuthController.getUser))

export default router
