import UserModel, { User } from '@/models/user.model'
import EmployeeModel, { Employee } from '@/models/employee.model'
import mongoose from 'mongoose'
import { convertToObjectId } from '@/helpers/convertObjectId'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import { BadRequestError } from '@/core/error.response'

interface EmployeeCreateData {
  name: string
  phone: string
  email: string
  role: string[]
  type: 'PARTTIME' | 'FULLTIME'
  image_url?: string
  created_by?: string
  reason: string
}

interface EmployeeUpdateData {
  name?: string
  phone?: string
  email?: string
  role?: string[]
  type?: 'PARTTIME' | 'FULLTIME'
  image_url?: string
  disable?: boolean
  reason: string
  edited_by: string
}

interface EmployeeDeleteData {
  userId: string
  reason: string
}

class EmployeeService {
  async getAllEmployees() {
    const employees = await EmployeeModel.find()
    const user = await UserModel.find({ _id: { $in: employees.map((employee) => employee.userId) } }).select(
      '-password'
    )

    return new OkResponse(
      'Get all employees successfully',
      employees.map((employee) => {
        const userData = user.find((user) => user._id.toString() === employee.userId.toString())
        return {
          ...employee.toObject(),
          user: userData
        }
      })
    )
  }

  async getEmployeeById(id: string) {
    const employee = await EmployeeModel.findOne({ userId: convertToObjectId(id) })
    if (!employee) throw new BadRequestError('Employee not found')
    const user = await UserModel.findById(employee.userId).select('-password')
    return { message: 'Get employee successfullly', employee: { ...employee.toObject(), user } }
  }

  async createEmployee({ payload, id }: { payload: EmployeeCreateData; id: string }) {
    const { name, phone, email, role, type, image_url } = payload

    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] })
    if (existingUser) {
      throw new Error(existingUser.email === email ? 'Email is existed' : 'Phone is existed')
    }
    let password = email.split('@')[0]

    //Create first employee in db
    const firstEmployee = (await EmployeeModel.countDocuments()) === 0
    const user = await UserModel.create({
      name,
      phone,
      email,
      active: true,
      role: firstEmployee ? ['MANAGER'] : role,
      password: password
    })

    await EmployeeModel.create({
      userId: user._id,
      type: firstEmployee ? 'FULLTIME' : type,
      image_url: image_url,
      created_by: firstEmployee ? user._id : id
    })

    return new CreatedResponse('Create employee successfully', {
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: firstEmployee ? ['MANAGER'] : role,
        type: firstEmployee ? 'FULLTIME' : type,
        image_url: image_url
      }
    })
  }

  async updateEmployee({ payload, id, employeeId }: { payload: EmployeeUpdateData; id: string; employeeId: string }) {
    const { name, phone, email, reason, role, type, image_url, disable } = payload

    const editedUser = await UserModel.findById(employeeId)
    if (!editedUser) throw new Error('The edited user does not exist')

    const employee = await EmployeeModel.findOne({ _id: id, deleted: false }).populate('userId')
    if (!employee) throw new Error('Nhân viên không tồn tại')

    const user = employee.userId as any
    if (!user) throw new Error('Không tìm thấy thông tin user của nhân viên')

    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] })
    if (existingUser) {
      throw new Error(existingUser.email === email ? 'Email is existed' : 'Phone is existed')
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      convertToObjectId(employeeId),
      { name, phone, email },
      { new: true }
    )
    if (!updatedUser) throw new Error('Không thể cập nhật thông tin người dùng')
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      { userId: employeeId },
      {
        $set: {
          role: role,
          type: type,
          disable: disable,
          image_url: image_url,
          reason: reason
        },
        $push: {
          edit_history: {
            edited_by: editedUser._id,
            reason: reason
          }
        }
      }
    )

    const updatedEmployeeData = {
      ...updatedUser,
      ...updatedEmployee
    }

    return new OkResponse('Update employee successfull', updatedEmployeeData)
  }

  async deleteEmployee({ id, payload: { userId, reason } }: { id: string; payload: EmployeeDeleteData }) {
    const employee = await EmployeeModel.findOneAndUpdate(
      { userId: convertToObjectId(userId) },
      {
        $set: {
          deleted: true,
          deleted_by: new mongoose.Types.ObjectId(id)
        },
        $push: {
          edit_history: {
            edited_by: new mongoose.Types.ObjectId(id),
            reason: reason
          }
        }
      }
    )
    if (!employee) throw new BadRequestError('Employee not found')
    return new OkResponse('Delete employee successfully', employee)
  }
}

const employeeService = new EmployeeService()
export default employeeService
