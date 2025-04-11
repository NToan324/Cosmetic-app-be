import { Router } from 'express'
import AuthController from '@/controllers/auth.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { AuthValidation } from '@/validation/auth.validation'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
const router = Router()

//Forgot password
router.post(
  '/forgot-password',
  validationRequest(AuthValidation.forgotPasswordSchema()),
  asyncHandler(AuthController.forgotPassword)
)
router.post('/verify-otp', validationRequest(AuthValidation.verifyOtp()), asyncHandler(AuthController.verifyOtp))
router.post(
  '/reset-password',
  validationRequest(AuthValidation.resetPassword()),
  asyncHandler(AuthController.resetPassword)
)
router.post('/resend-otp', asyncHandler(AuthController.resendOtp))
router.get('/otp', asyncHandler(AuthController.getOtp))

//Get user by phone or email
router.get('/me', verifyJWT, asyncHandler(AuthController.getMe))
router.get('/user', asyncHandler(AuthController.getUserByPhoneOrEmail))

//Sign up and login
router.post('/signup', validationRequest(AuthValidation.signupSchema()), asyncHandler(AuthController.signup))
router.post('/login', validationRequest(AuthValidation.loginSchema()), asyncHandler(AuthController.login))

router.get('/:id', asyncHandler(AuthController.getUser))
router.delete('/:id', asyncHandler(AuthController.deleteUser))
router.post('/tokens', AuthController.refreshToken)

export default router
