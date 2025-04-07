import categoryService from '@/services/category.service'
import type { Request, Response } from 'express'
import { ZodError } from 'zod'

class CategoryController {
  async createCategory(req: Request, res: Response) {
    const payload = req.body
    res.send(await categoryService.createCategory(payload))
  }

  async getCategories(req: Request, res: Response) {
    res.send(await categoryService.getCategories())
  }

  async getCategoryById(req: Request, res: Response) {
    const { id } = req.params
    res.send(await categoryService.getCategoryById(id))
  }

  async updateCategory(req: Request, res: Response) {
    const payload = req.body
    const { id } = req.params
    res.send(await categoryService.updateCategory({ id, payload }))
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params
    res.send(await categoryService.deleteCategory(id))
  }
}

const categoryController = new CategoryController()
export default categoryController
