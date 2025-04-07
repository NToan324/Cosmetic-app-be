import z from 'zod'

export class CategoryValidation {
  static createCategory() {
    return {
      body: z.object({
        name: z.string().nonempty('Tên danh mục không được để trống'),
        description: z.string().optional()
      })
    }
  }

  static updateCategory() {
    return {
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional()
      })
    }
  }
}
