import z from 'zod';

class EmployeeValidation {
  createEmployee() {
    return z
      .object({
        name: z.string().nonempty('Tên không được để trống'),
        phone: z.string().nonempty('Số điện thoại không được để trống'),
        email: z.string().email('Email không hợp lệ').nonempty('Email không được để trống'),
        reason: z.string().nonempty('Lý do không được để trống'),
        role: z.array(z.enum(['MANAGER', 'SALESTAFF', 'CONSULTANT'])).nonempty('Vai trò không được để trống'),
        type: z.enum(['PARTTIME', 'FULLTIME']).default('FULLTIME'),
        created_by: z.string().optional(),
      })
      .refine(
        (data) => {
          if (data.type === 'PARTTIME') {
            return data.role.length === 1 && data.role[0] === 'SALESTAFF';
          }
          return true;
        },
        { message: 'Nhân viên part-time chỉ được có role SALESTAFF', path: ['role'] }
      );
  }

  updateEmployee() {
    return z.object({
      name: z.string().nonempty('Tên không được để trống').optional(),
      phone: z.string().nonempty('Số điện thoại không được để trống').optional(),
      email: z.string().email('Email không hợp lệ').optional(),
      reason: z.string().nonempty('Lý do không được để trống'),
      role: z.array(z.enum(['MANAGER', 'SALESTAFF', 'CONSULTANT'])).optional(),
      type: z.enum(['PARTTIME', 'FULLTIME']).optional(),
      disable: z.boolean().optional(),
      edited_by: z.string().nonempty('Thiếu thông tin người chỉnh sửa'),
    });
  }

  deleteEmployee() {
    return z.object({
      deleted_by: z.string().nonempty('Thiếu thông tin người xóa'),
      reason: z.string().nonempty('Lý do không được để trống'),
    });
  }
}

const employeeValidation = new EmployeeValidation();
export default employeeValidation;