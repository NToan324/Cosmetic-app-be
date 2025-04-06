import express from 'express';
import employeeController from '@/controllers/employee.controller';
import asyncHandler from '@/middleware/asyncHandler';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.none(), asyncHandler(employeeController.createEmployee));
router.put('/:id', upload.none(), asyncHandler(employeeController.updateEmployee));
router.put('/:id', upload.none(), asyncHandler(employeeController.deleteEmployee));
router.get('/:id', asyncHandler(employeeController.getEmployeeById));
router.get('/', asyncHandler(employeeController.getAllEmployees));

export default router;