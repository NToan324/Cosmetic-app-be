import { BadRequestError } from '@/core/error.response'
import { OkResponse } from '@/core/success.response'
import { convertToObjectId } from '@/helpers/convertObjectId'
import shiftModel from '@/models/shift.model'

class ShiftService {
  async getAllShifts() {
    const shift = await shiftModel.find()
    return new OkResponse('Get all shifts successfully', shift)
  }

  async getShiftById(id: string) {
    const [shift] = await shiftModel.find({ employee_id: id, is_closed: false })
    if (!shift) {
      throw new BadRequestError('Shift not found')
    }
    return new OkResponse('Get shift successfully', shift)
  }

  async checkShiftById(id: string) {
    const [shift] = await shiftModel.find({ employee_id: id, is_closed: false })
    console.log(shift)
    if (!shift) {
      throw new BadRequestError('Shift not found')
    }
    return new OkResponse('Check shift successfully', shift)
  }

  async createShift({ id, opening_cash }: { id: string; opening_cash: number }) {
    //check if shift is already opened
    const existingShift = await shiftModel.findOne({ employee_id: convertToObjectId(id), is_closed: false })
    if (existingShift) {
      throw new BadRequestError('Ca làm đang được mở, không thể mở ca mới')
    }
    const shift = await shiftModel.create({
      employee_id: id,
      opening_cash,
      current_cash: opening_cash
    })

    return new OkResponse('Create shift successfully', shift)
  }

  async closeShift(id: string, actual_cash: number, note: string) {
    const shift = await shiftModel.findOneAndUpdate(
      { employee_id: id, is_closed: false },
      { actual_cash, note, is_closed: true, end_time: Date.now() },
      { new: true }
    )
    if (!shift) {
      throw new BadRequestError('Shift not found')
    }
    return new OkResponse('Close shift successfully', shift)
  }

  async deleteShiftById(id: string, shiftId: string) {
    const shift = await shiftModel.findByIdAndDelete(shiftId)
    if (!shift) {
      throw new BadRequestError('Shift not found')
    }
    return new OkResponse('Delete shift successfully', shift)
  }
}

const shiftService = new ShiftService()

export default shiftService
