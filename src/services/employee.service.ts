import UserModel, { User } from '@/models/user.model';
import EmployeeModel, { Employee } from '@/models/employee.model';
import mongoose from 'mongoose';

interface EmployeeCreateData {
  name: string;
  phone: string;
  email: string;
  role: string[];
  type: 'PARTTIME' | 'FULLTIME';
  image_url?: string;
  created_by?: string;
  reason: string;
}

interface EmployeeUpdateData {
  name?: string;
  phone?: string;
  email?: string;
  role?: string[];
  type?: 'PARTTIME' | 'FULLTIME';
  image_url?: string;
  disable?: boolean;
  reason: string;
  edited_by: string;
}

interface EmployeeDeleteData {
  deleted_by: string;
  reason: string;
}

class EmployeeService {
  async createEmployee(data: EmployeeCreateData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { name, phone, email, role, type, image_url, created_by, reason } = data;

      // Kiểm tra trùng email và phone
      const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        throw new Error(existingUser.email === email ? 'Email đã tồn tại' : 'Số điện thoại đã tồn tại');
      }

      const isFirstEmployee = await EmployeeModel.countDocuments() === 0;
      const newUser = await UserModel.create([{ name, phone, email, active: true, password: email }], { session });
      const userId = newUser[0]._id;

      const newEmployee = await EmployeeModel.create(
        [
          {
            userId,
            role: isFirstEmployee ? ['MANAGER'] : role,
            type,
            image_url: image_url || '@/assets/images/default_avatar.jpg',
            created_by: isFirstEmployee ? null : new mongoose.Types.ObjectId(created_by),
            edit_history: [
              {
                edited_by: isFirstEmployee ? null : new mongoose.Types.ObjectId(created_by),
                reason,
                changes: { after: { name, phone, email, role: isFirstEmployee ? ['MANAGER'] : role, type } },
              },
            ],
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return { message: 'Thêm nhân viên thành công', data: newEmployee[0] };
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateEmployee(id: string, data: EmployeeUpdateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID nhân viên không hợp lệ');
    if (!mongoose.Types.ObjectId.isValid(data.edited_by)) throw new Error('ID người chỉnh sửa không hợp lệ');

    const employee = await EmployeeModel.findOne({ _id: id, deleted: false }).populate('userId');
    if (!employee) throw new Error('Nhân viên không tồn tại');

    const user = employee.userId as any;
    if (!user) throw new Error('Không tìm thấy thông tin user của nhân viên');

    // Kiểm tra trùng email và phone nếu thay đổi
    if (data.email && data.email !== user.email) {
      const existingEmail = await UserModel.findOne({ email: data.email });
      if (existingEmail) throw new Error('Email đã tồn tại');
    }
    if (data.phone && data.phone !== user.phone) {
      const existingPhone = await UserModel.findOne({ phone: data.phone });
      if (existingPhone) throw new Error('Số điện thoại đã tồn tại');
    }

    // Lấy dữ liệu trước khi thay đổi
    const beforeUser = { name: user.name, phone: user.phone, email: user.email };
    const beforeEmployee = { role: employee.role, type: employee.type, disable: employee.disable, image_url: employee.image_url };

    // Chuẩn bị dữ liệu thay đổi
    const changesUser: Partial<User> = {};
    const changesEmployee: Partial<Employee> = {};
    const historyBefore: any = {};
    const historyAfter: any = {};

    if (data.name && data.name !== user.name) {
      changesUser.name = data.name;
      historyBefore.name = user.name;
      historyAfter.name = data.name;
    }
    if (data.phone && data.phone !== user.phone) {
      changesUser.phone = data.phone;
      historyBefore.phone = user.phone;
      historyAfter.phone = data.phone;
    }
    if (data.email && data.email !== user.email) {
      changesUser.email = data.email;
      historyBefore.email = user.email;
      historyAfter.email = data.email;
    }
    if (data.role && JSON.stringify(data.role) !== JSON.stringify(employee.role)) {
      changesEmployee.role = data.role;
      historyBefore.role = employee.role;
      historyAfter.role = data.role;
    }
    if (data.type && data.type !== employee.type) {
      changesEmployee.type = data.type;
      historyBefore.type = employee.type;
      historyAfter.type = data.type;
    }
    if (data.image_url && data.image_url !== employee.image_url) {
      changesEmployee.image_url = data.image_url;
      historyBefore.image_url = employee.image_url;
      historyAfter.image_url = data.image_url;
    }
    if (data.disable !== undefined && data.disable !== employee.disable) {
      changesEmployee.disable = data.disable;
      historyBefore.disable = employee.disable;
      historyAfter.disable = data.disable;
    }

    // Cập nhật dữ liệu nếu có thay đổi
    if (Object.keys(changesUser).length > 0) {
      await UserModel.findByIdAndUpdate(employee.userId, changesUser);
    }
    if (Object.keys(changesEmployee).length > 0 || Object.keys(changesUser).length > 0) {
      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
        id,
        {
          $set: changesEmployee,
          $push: {
            edit_history: {
              edited_by: new mongoose.Types.ObjectId(data.edited_by),
              reason: data.reason,
              changes: {
                before: historyBefore,
                after: historyAfter,
              },
            },
          },
        },
        { new: true }
      ).populate('userId');
      return { message: 'Cập nhật nhân viên thành công', data: updatedEmployee };
    }
    return { message: 'Không có thay đổi nào được thực hiện', data: employee };
  }

  async deleteEmployee(id: string, data: EmployeeDeleteData) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID nhân viên không hợp lệ');
    if (!mongoose.Types.ObjectId.isValid(data.deleted_by)) throw new Error('ID người xóa không hợp lệ');

    const employee = await EmployeeModel.findOne({ _id: id, deleted: false });
    if (!employee) throw new Error('Nhân viên không tồn tại');

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      {
        $set: {
          deleted: true,
          deleted_by: new mongoose.Types.ObjectId(data.deleted_by),
          deleted_at: new Date(),
        },
        $push: {
          edit_history: {
            edited_by: new mongoose.Types.ObjectId(data.deleted_by),
            reason: data.reason,
            changes: { before: { deleted: false }, after: { deleted: true } },
          },
        },
      },
      { new: true }
    ).populate('userId');

    if (!updatedEmployee) throw new Error('Không thể xóa nhân viên');
    return { message: 'Xóa nhân viên thành công', data: updatedEmployee };
  }

  async getEmployeeById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID nhân viên không hợp lệ');
    const employee = await EmployeeModel.findOne({ _id: id, deleted: false })
      .populate('userId')
      .populate('edit_history.edited_by', 'name');
    if (!employee) throw new Error('Nhân viên không tồn tại');
    return { message: 'Lấy thông tin nhân viên thành công', data: employee };
  }

  async getAllEmployees() {
    const employees = await EmployeeModel.find({ deleted: false })
      .populate('userId')
      .populate('edit_history.edited_by', 'name');
    return { message: 'Lấy danh sách nhân viên thành công', data: employees };
  }
}

const employeeService = new EmployeeService();
export default employeeService;