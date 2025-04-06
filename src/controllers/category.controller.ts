import categoryService from '@/services/category.service';
import categoryValidation from '@/validation/category.validation'; // Sẽ tạo ở bước sau
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {
      const schema = categoryValidation.createCategory().body;
      const validatedData = schema.parse(req.body);
      const newCategory = await categoryService.createCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const schema = categoryValidation.updateCategory().body;
      const validatedData = schema.parse(req.body);
      const category = await categoryService.updateCategory(req.params.id, validatedData);
      res.status(200).json(category);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.deleteCategory(req.params.id);
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

const categoryController = new CategoryController();
export default categoryController;