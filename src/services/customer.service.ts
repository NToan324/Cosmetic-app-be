import UserModel from '@/models/user.model';
import CustomerModel from '@/models/customer.model';
import { convertToObjectId } from '@/helpers/convertObjectId';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import { BadRequestError } from '@/core/error.response';

interface User {
  _id: string;
  name: string;
  phone: string;
  role: string[];
  active: boolean;
}

interface EditedBy {
  _id: string;
  name: string;
}

export interface CustomerEditHistory {
  edited_at: string;
  edited_by: EditedBy;
  reason: string;
}

export interface Customer {
  userId: string;
  rank: string;
  point: number;
  note: string;
  created_at: string;
  created_by: string;
  edit_history: CustomerEditHistory[];
  user: User;
}

export interface CustomerCreateData {
  name?: string;
  phone: string;
  note?: string;
  reason: string; // reason là bắt buộc
}

export interface CustomerUpdateData {
  name?: string;
  phone?: string;
  note?: string;
  reason: string; // reason là bắt buộc
}

class CustomerService {
  async getAllCustomers(page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [total, customers] = await Promise.all([
      CustomerModel.countDocuments(),
      CustomerModel.find().skip(skip).limit(limit)
    ])

    const users = await UserModel.find({ _id: { $in: customers.map((c) => c.userId) } }).select('-password')

    const data = customers.map((customer) => {
      const userData = users.find((u) => u._id.toString() === customer.userId.toString())
      return {
        ...customer.toObject(),
        user: userData
      }
    })

    return new OkResponse('Lấy danh sách khách hàng thành công', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: data
    })
  }

  async getCustomerById(id: string) {
    const customer = await CustomerModel.findOne({ userId: convertToObjectId(id) }).populate({
      path: 'edit_history.edited_by',
      select: '_id name'
    })
    if (!customer) throw new BadRequestError('Khách hàng không tồn tại')
    const user = await UserModel.findById(customer.userId).select('-password')
    return {
      message: 'Lấy thông tin khách hàng thành công',
      customer: {
        ...customer.toObject(),
        user
      }
    }
  }

  async createCustomer({ payload, id }: { payload: CustomerCreateData; id?: string }) {
    let { name, phone, note, reason } = payload;

    // Kiểm tra số điện thoại đã tồn tại
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      throw new BadRequestError('Số điện thoại đã tồn tại');
    }

    // Nếu không có tên, đặt mặc định là "KH" + 4 số cuối
    if (!name) {
      const lastFourDigits = phone.slice(-4);
      name = `KH${lastFourDigits}`;
    }

    // Đặt mật khẩu mặc định là số điện thoại
    const password = phone;

    // Tạo user với role là CUSTOMER
    const user = await UserModel.create({
      name,
      phone,
      email: '',
      role: ['CUSTOMER'],
      password,
    });

    // Thiết lập created_by và reason
    const createdBy = id ? convertToObjectId(id) : user._id;
    const finalReason = id ? reason : 'Khách hàng tự đăng ký';

    // Tạo khách hàng
    const customer = await CustomerModel.create({
      userId: user._id,
      rank: 'MEMBER',
      point: 0,
      note: note || '',
      created_by: createdBy,
      edit_history: id
        ? [
            {
              edited_at: new Date().toISOString(),
              edited_by: { _id: id, name: 'Khách hàng' }, // Giả sử tên lấy từ phiên đăng nhập
              reason: finalReason,
            },
          ]
        : [],
    });

    return new CreatedResponse('Thêm khách hàng thành công', {
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      customer: {
        rank: customer.rank,
        point: customer.point,
        note: customer.note,
      },
    });
  }

  async updateCustomer({ payload, id, customerId }: { payload: CustomerUpdateData; id?: string; customerId: string }) {
    const { name, phone, note, reason } = payload;

    const customer = await CustomerModel.findOne({ userId: convertToObjectId(customerId) });
    if (!customer) {
      throw new BadRequestError('Khách hàng không tồn tại');
    }

    const user = await UserModel.findById(customer.userId);
    if (!user) {
      throw new BadRequestError('Không tìm thấy thông tin người dùng');
    }

    // Thiết lập edited_by và reason
    const editedBy = id ? convertToObjectId(id) : customer.userId;
    const finalReason = id ? reason : 'Khách hàng chỉnh sửa thông tin';

    // Cập nhật thông tin user nếu có
    if (name) user.name = name;
    if (phone) {
      const existingUser = await UserModel.findOne({ phone });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        throw new BadRequestError('Số điện thoại đã tồn tại');
      }
      user.phone = phone;
    }
    await user.save();

    // Cập nhật thông tin khách hàng
    if (note !== undefined) customer.note = note;

    // Ghi lại lịch sử chỉnh sửa
    customer.edit_history.push({
      edited_at: new Date().toISOString(),
      edited_by: { _id: editedBy.toString(), name: user.name },
      reason: finalReason,
    });

    await customer.save();

    return new OkResponse('Cập nhật khách hàng thành công', {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      customer: {
        rank: customer.rank,
        point: customer.point,
        note: customer.note,
      },
    });
  }

  async deleteCustomer({ id, customerId }: { id: string; customerId: string }) {
    const customer = await CustomerModel.findOne({ userId: convertToObjectId(customerId) })
    if (!customer) throw new BadRequestError('Khách hàng không tồn tại')
    await Promise.all([
      UserModel.findByIdAndDelete(customer.userId),
      CustomerModel.findByIdAndDelete(customer._id)
    ])
    return new OkResponse('Xóa khách hàng thành công', {
      deleted_by: id
    })
  }

  async searchCustomer(phone: string) {
    const user = await UserModel
      .findOne({
        phone: { $regex: phone, $options: 'i' }
      })
      .select('-password')
      .limit(1)
    if (user) {
      console.log('user', user)
      const customer = await CustomerModel.findOne({
        userId: user._id
      })
      if (!customer) {
        throw new BadRequestError('Customer not found')
      }
      const customerDetails = {
        ...user.toObject(),
        customerDetails: {
          ...customer.toObject()
        }
      }
      return new OkResponse('Get customer successfully', customerDetails)
    }
    return new OkResponse('New customer', {})
  }
}

const customerService = new CustomerService()
export default customerService