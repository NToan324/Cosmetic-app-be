import z from 'zod'

export class ShiftValidation {
  static createShiftSchema() {
    return {
      body: z.object({
        opening_cash: z.number().min(0, 'Opening cash must be a positive number').optional()
      })
    }
  }

  static CloseShiftSchema() {
    return {
      body: z.object({
        actual_cash: z.number().min(0, 'Opening cash must be a positive number').optional(),
        note: z.string().optional()
      })
    }
  }
}
