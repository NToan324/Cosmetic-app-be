import { Request, Response } from 'express';
import employeeService from '@/services/employee.service';
import employeeValidation from '@/validation/employee.validation';
import { ZodError } from 'zod';
import EmployeeModel from '@/models/employee.model';

class EmployeeController {
    async createEmployee(req: Request, res: Response) {
        try {
          console.log('req.body received (create):', req.body);
          const isFirstEmployee = (await EmployeeModel.countDocuments()) === 0;
          const body = {
            ...req.body,
            created_by: isFirstEmployee ? undefined : (req.body?.created_by || '67f2d1bcbbc14768a52717df'),
            role: Array.isArray(req.body.role) ? req.body.role : (req.body.role ? [req.body.role] : []), // Chuyển chuỗi thành mảng
          };
          console.log('Validated body (create):', body);
          const validatedData = employeeValidation.createEmployee().parse(body);
          const result = await employeeService.createEmployee(validatedData);
          res.status(201).json(result);
        } catch (error: any) {
          console.error('Error in createEmployee:', error);
          if (error instanceof ZodError) {
            res.status(400).json({ message: error.errors[0].message });
          } else {
            res.status(500).json({ message: error.message || 'Lỗi khi thêm nhân viên' });
          }
        }
      }
      
      async updateEmployee(req: Request, res: Response) {
        try {
          console.log('req.body received (update):', req.body);
          const body = {
            ...req.body,
            edited_by: req.body?.edited_by || '67f2d1bcbbc14768a52717df',
            role: req.body.role ? (Array.isArray(req.body.role) ? req.body.role : [req.body.role]) : undefined, // Chuyển chuỗi thành mảng
          };
          console.log('Validated body (update):', body);
          const validatedData = employeeValidation.updateEmployee().parse(body);
          const result = await employeeService.updateEmployee(req.params.id, validatedData);
          res.status(200).json(result);
        } catch (error: any) {
          console.error('Error in updateEmployee:', error);
          if (error instanceof ZodError) {
            res.status(400).json({ message: error.errors[0].message });
          } else {
            res.status(500).json({ message: error.message || 'Lỗi khi cập nhật nhân viên' });
          }
        }
      }
      
  // Các hàm khác giữ nguyên
  async deleteEmployee(req: Request, res: Response) {
    try {
      const validatedData = employeeValidation.deleteEmployee().parse(req.body);
      const result = await employeeService.deleteEmployee(req.params.id, validatedData);
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: error.message || 'Lỗi khi xóa nhân viên' });
      }
    }
  }

  async getEmployeeById(req: Request, res: Response) {
    try {
      const result = await employeeService.getEmployeeById(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Không tìm thấy nhân viên' });
    }
  }

  async getAllEmployees(req: Request, res: Response) {
    try {
      const result = await employeeService.getAllEmployees();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Lỗi khi lấy danh sách nhân viên' });
    }
  }
}

const employeeController = new EmployeeController();
export default employeeController;