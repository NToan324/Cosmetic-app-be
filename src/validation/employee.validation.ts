import user from '@/models/user.model'
import { isValidObjectId } from 'mongoose'
import z from 'zod'

export class EmployeeValidation {
  static createEmployee() {
    return {
      body: z
        .object({
          name: z.string().nonempty('Tên không được để trống'),
          phone: z.string().nonempty('Số điện thoại không được để trống'),
          email: z.string().email('Email không hợp lệ').nonempty('Email không được để trống'),
          role: z.array(z.enum(['MANAGER', 'SALESTAFF', 'CONSULTANT'])).nonempty('Vai trò không được để trống'),
          type: z.enum(['PARTTIME', 'FULLTIME']).default('FULLTIME')
        })
        .refine(
          (data) => {
            if (data.type === 'PARTTIME') {
              return data.role.length === 1 && data.role[0] === 'SALESTAFF'
            }
            return true
          },
          { message: 'Nhân viên parttime chỉ được có role SALESTAFF', path: ['role'] }
        )
    }
  }

  static updateEmployee() {
    return {
      body: z.object({
        name: z.string().nonempty('Tên không được để trống').optional(),
        phone: z.string().nonempty('Số điện thoại không được để trống').optional(),
        imageUrl: z.string().optional(),
        email: z.string().email('Email không hợp lệ').optional(),
        reason: z.string().nonempty('Lý do không được để trống'),
        role: z.array(z.enum(['MANAGER', 'SALESTAFF', 'CONSULTANT'])).optional(),
        type: z.enum(['PARTTIME', 'FULLTIME']).optional(),
        disable: z.boolean().optional()
      })
    }
  }

  static deleteEmployee() {
    return {
      body: z.object({
        userId: z.string().refine((val) => isValidObjectId(val), 'ID không hợp lệ'),
        reason: z.string().nonempty('Lý do không được để trống')
      })
    }
  }
}
