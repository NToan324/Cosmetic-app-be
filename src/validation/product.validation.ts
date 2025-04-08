import z from 'zod'
import { Request, Response } from 'express'
import { ZodError } from 'zod'
import productService from '@/services/product.service'

export class ProductValidation {
  static createProduct() {
    return {
      body: z
        .object({
          name: z.string().nonempty('Tên sản phẩm không được để trống'),
          description: z.string().nonempty('Mô tả sản phẩm không được để trống'),
          price: z.number({ invalid_type_error: 'Giá phải là số' }).positive('Giá phải là số dương'),
          stock_quantity: z
            .number({ invalid_type_error: 'Số lượng tồn kho phải là số' })
            .int('Số lượng tồn kho phải là số nguyên')
            .positive('Số lượng tồn kho phải là số dương'),
          units: z.enum(['BOX', 'TUBE', 'PACK', 'PCS'], {
            errorMap: () => ({ message: 'Đơn vị không hợp lệ' })
          }),
          category_id: z.string().nonempty('Mã loại sản phẩm không được để trống'),
          brand_id: z.string().nonempty('Mã hiệu sản phẩm không được để trống'),
          image_url: z.string().optional(),
          production_date: z.preprocess(
            (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
            z.date({ invalid_type_error: 'Ngày sản xuất không hợp lệ' })
          ),
          expiration_date: z.preprocess(
            (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
            z.date({ invalid_type_error: 'Hạn sử dụng không hợp lệ' })
          ),
          release_date: z
            .preprocess((arg) => {
              if (!arg) return new Date()
              if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
              return arg
            }, z.date({ invalid_type_error: 'Ngày mở bán không hợp lệ' }))
            .optional(),
          discontinued_date: z
            .preprocess((arg) => {
              if (!arg) return null
              if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
              return arg
            }, z.date({ invalid_type_error: 'Ngày ngưng mở bán không hợp lệ' }).nullable())
            .optional(),
          disable: z.boolean().optional().default(true)
        })
        .refine(
          (data) => {
            const prodDate = data.production_date
            const expDate = data.expiration_date
            return prodDate instanceof Date && expDate instanceof Date && expDate > prodDate
          },
          { message: 'Hạn sử dụng phải sau ngày sản xuất', path: ['expiration_date'] }
        )
        .refine(
          (data) => {
            if (!data.discontinued_date) return true
            const releaseDate = data.release_date ?? new Date()
            const discDate = data.discontinued_date
            return discDate instanceof Date && releaseDate instanceof Date && discDate > releaseDate
          },
          { message: 'Ngày ngưng bán phải sau ngày mở bán', path: ['discontinued_date'] }
        )
    }
  }
  static updateProduct() {
    return {
      body: z
        .object({
          name: z.string().nonempty('Tên sản phẩm không được để trống').optional(),
          description: z.string().nonempty('Mô tả sản phẩm không được để trống').optional(),
          price: z.number({ invalid_type_error: 'Giá phải là số' }).positive('Giá phải là số dương').optional(),
          stock_quantity: z
            .number({ invalid_type_error: 'Số lượng tồn kho phải là số' })
            .int('Số lượng tồn kho phải là số nguyên')
            .positive('Số lượng tồn kho phải là số dương')
            .optional(),
          units: z
            .enum(['BOX', 'TUBE', 'PACK', 'PCS'], {
              errorMap: () => ({ message: 'Đơn vị không hợp lệ' })
            })
            .optional(),
          category_id: z.string().nonempty('Mã loại sản phẩm không được để trống').optional(),
          brand_id: z.string().nonempty('Mã hiệu sản phẩm không được để trống').optional(),
          image_url: z.string().optional(),
          production_date: z
            .preprocess(
              (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
              z.date({ invalid_type_error: 'Ngày sản xuất không hợp lệ' })
            )
            .optional(),
          expiration_date: z
            .preprocess(
              (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
              z.date({ invalid_type_error: 'Hạn sử dụng không hợp lệ' })
            )
            .optional(),
          release_date: z
            .preprocess((arg) => {
              if (!arg) return undefined
              if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
              return arg
            }, z.date({ invalid_type_error: 'Ngày mở bán không hợp lệ' }))
            .optional(),
          discontinued_date: z
            .preprocess((arg) => {
              if (!arg) return null
              if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
              return arg
            }, z.date({ invalid_type_error: 'Ngày ngưng mở bán không hợp lệ' }).nullable())
            .optional(),
          disable: z.boolean().optional()
        })
        .refine(
          (data) => {
            if (!data.production_date || !data.expiration_date) return true
            const { production_date, expiration_date } = data
            return (
              production_date instanceof Date && expiration_date instanceof Date && expiration_date > production_date
            )
          },
          { message: 'Hạn sử dụng phải sau ngày sản xuất', path: ['expiration_date'] }
        )
        .refine(
          (data) => {
            if (!data.discontinued_date || !data.release_date) return true
            const { discontinued_date, release_date } = data
            return discontinued_date instanceof Date && release_date instanceof Date && discontinued_date > release_date
          },
          { message: 'Ngày ngưng bán phải sau ngày mở bán', path: ['discontinued_date'] }
        )
    }
  }
}
