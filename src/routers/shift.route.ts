import shiftController from '@/controllers/shift.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
import { ShiftValidation } from '@/validation/shift.validation'
import { Router } from 'express'
const router = Router()

router.get('/', verifyJWT, asyncHandler(shiftController.getAllShifts))
router.get('/user', verifyJWT, asyncHandler(shiftController.getShiftById))
router.delete('/:id', verifyJWT, asyncHandler(shiftController.deleteShiftById))
router.post(
  '/',
  verifyJWT,
  validationRequest(ShiftValidation.createShiftSchema()),
  asyncHandler(shiftController.createShift)
)
router.patch(
  '/',
  verifyJWT,
  validationRequest(ShiftValidation.CloseShiftSchema()),
  asyncHandler(shiftController.closeShift)
)
router.get('/check', verifyJWT, asyncHandler(shiftController.checkShiftById))

export default router
