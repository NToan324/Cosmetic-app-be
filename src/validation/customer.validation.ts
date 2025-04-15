import z from 'zod'

export class CustomerValidation {
  static createCustomer() {
    return {
      body: z.object({
        phone: z.string().nonempty('Số điện thoại không được để trống'),
        name: z.string().optional(),
        note: z.string().optional()
      })
    }
  }

  static updateCustomer() {
    return {
      body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        note: z.string().optional(),
        point: z.number().optional(),
        rank: z.enum(['MEMBER', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND', 'PLATINUM']).optional(),
        reason: z.string().nonempty('Lý do không được để trống')
      })
    }
  }
}