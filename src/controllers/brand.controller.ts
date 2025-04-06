import brandService from '@/services/brand.service';
import brandValidation from '@/validation/brand.validation';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

class BrandController {
  async createBrand(req: Request, res: Response) {
    try {
      const schema = brandValidation.createBrand().body;
      const validatedData = schema.parse(req.body);
      const newBrand = await brandService.createBrand(validatedData);
      res.status(201).json(newBrand);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async getBrands(req: Request, res: Response) {
    try {
      const brands = await brandService.getBrands();
      res.status(200).json(brands);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getBrandById(req: Request, res: Response) {
    try {
      const brand = await brandService.getBrandById(req.params.id);
      res.status(200).json(brand);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateBrand(req: Request, res: Response) {
    try {
      const schema = brandValidation.updateBrand().body;
      const validatedData = schema.parse(req.body);
      const brand = await brandService.updateBrand(req.params.id, validatedData);
      res.status(200).json(brand);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async deleteBrand(req: Request, res: Response) {
    try {
      const brand = await brandService.deleteBrand(req.params.id);
      res.status(200).json(brand);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

const brandController = new BrandController();
export default brandController;