import z from 'zod';

class CategoryValidation {
  createCategory() {
    return {
      body: z.object({
        name: z.string().nonempty('Tên danh mục không được để trống'),
        description: z.string().optional(),
      }),
    };
  }

  updateCategory() {
    return {
      body: z.object({
        name: z.string().nonempty('Tên danh mục không được để trống').optional(),
        description: z.string().optional(),
      }),
    };
  }
}

const categoryValidation = new CategoryValidation();
export default categoryValidation;