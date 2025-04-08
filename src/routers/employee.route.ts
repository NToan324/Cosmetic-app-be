import express from 'express'
import employeeController from '@/controllers/employee.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { EmployeeValidation } from '@/validation/employee.validation'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'

const router = express.Router()

router.get('/', verifyJWT, asyncHandler(employeeController.getAllEmployees))
router.get('/:id', asyncHandler(employeeController.getEmployeeById))
router.post(
  '/',
  verifyJWT,
  validationRequest(EmployeeValidation.createEmployee()),
  asyncHandler(employeeController.createEmployee)
)
router.patch(
  '/:id',
  verifyJWT,
  validationRequest(EmployeeValidation.updateEmployee()),
  asyncHandler(employeeController.updateEmployee)
)
router.delete('/:id', verifyJWT, asyncHandler(employeeController.deleteEmployee))

export default router
