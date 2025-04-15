import shiftService from '@/services/shift.service'
import type { Request, Response } from 'express'

class ShiftController {
  async getAllShifts(req: Request, res: Response) {
    res.send(await shiftService.getAllShifts())
  }

  async getShiftById(req: Request, res: Response) {
    const { id } = req.user
    res.send(await shiftService.getShiftById(id))
  }

  async checkShiftById(req: Request, res: Response) {
    const { id } = req.user
    res.send(await shiftService.checkShiftById(id))
  }

  async createShift(req: Request, res: Response) {
    const { id } = req.user
    const { opening_cash } = req.body
    const shift = await shiftService.createShift({ id, opening_cash })
    res.send(shift)
  }

  async closeShift(req: Request, res: Response) {
    const { id } = req.user
    const { actual_cash, note } = req.body
    res.send(await shiftService.closeShift(id, actual_cash, note))
  }

  async deleteShiftById(req: Request, res: Response) {
    const { id } = req.user
    const { id: shiftId } = req.params
    res.send(await shiftService.deleteShiftById(id, shiftId))
  }
}

const shiftController = new ShiftController()
export default shiftController
