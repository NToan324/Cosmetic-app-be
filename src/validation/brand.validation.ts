import z from 'zod'

export class BrandValidation {
  static createBrand() {
    return {
      body: z.object({
        name: z.string().nonempty('Tên thương hiệu không được để trống'),
        description: z.string().optional(),
        country: z.string().optional(),
        logo_url: z.string().optional()
      })
    }
  }

  static updateBrand() {
    return {
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        country: z.string().optional(),
        logo_url: z.string().optional()
      })
    }
  }
}
