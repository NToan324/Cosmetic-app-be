import user from '@/models/user.model'
import { isValidObjectId } from 'mongoose'
import z from 'zod'

export class OrderValidation {
  static createOrder() {
    return {
      body: z.object({
        userId: z.string().min(24).optional(),
        createdBy: z.string().min(24).optional(),
        order: z.object({
          items: z
            .array(
              z.object({
                product_id: z.string().min(24, 'ID sản phẩm không hợp lệ'),
                quantity: z.number().int().gt(0, 'Số lượng phải lớn hơn 0'),
                price: z.number().nonnegative('Giá sản phẩm không được âm')
              })
            )
            .min(1, 'Đơn hàng phải có ít nhất 1 sản phẩm'),
          discount_point: z.number().nonnegative().optional(),
          payment_method: z.enum(['Cash', 'Bank Transfer', 'VNPay']).default('Cash')
        })
      })
    }
  }
}
