import productService from '@/services/product.service';
import productValidation from '@/validation/product.validation';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

class ProductController {
  //Thêm sản phẩm
  async createProduct(req: Request, res: Response) {
    try {
      const schema = productValidation.createProduct().body;
      const validatedData = schema.parse(req.body);
      const newProduct = await productService.createProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors[0].message;
        res.status(400).json({ message: errorMessage });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  //Lấy sản phẩm
  async getProducts(req: Request, res: Response) {
    try {
      const products = await productService.getProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  //Láy 1 sản phẩm
  async getProductById(req: Request, res: Response) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Xóa sản phẩm
  async deleteProduct(req: Request, res: Response) {
    try {
      const product = await productService.deleteProduct(req.params.id);
      res.status(200).json(product);
    } catch (error: any) {
      if (error.message.includes('đã bị xóa từ')) {
        res.status(400).json({ message: error.message }); // 400 cho lỗi logic
      } else {
        res.status(404).json({ message: error.message }); // 404 cho không tìm thấy
      }
    }
  }
}

const productController = new ProductController();
export default productController;