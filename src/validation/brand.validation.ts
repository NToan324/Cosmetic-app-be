import z from 'zod';

class BrandValidation {
  createBrand() {
    return {
      body: z.object({
        name: z.string().nonempty('Tên thương hiệu không được để trống'),
        description: z.string().optional(),
        country: z.string().optional(),
        logo_url: z.string().optional(),
      }),
    };
  }

  updateBrand() {
    return {
      body: z.object({
        name: z.string().nonempty('Tên thương hiệu không được để trống').optional(),
        description: z.string().optional(),
        country: z.string().optional(),
        logo_url: z.string().optional(),
      }),
    };
  }
}

const brandValidation = new BrandValidation();
export default brandValidation;