import brandService from '@/services/brand.service'
import type { Request, Response } from 'express'

class BrandController {
  async createBrand(req: Request, res: Response) {
    const payload = req.body
    res.send(await brandService.createBrand(payload))
  }

  async getBrands(req: Request, res: Response) {
    res.send(await brandService.getBrands())
  }

  async getBrandById(req: Request, res: Response) {
    const { id } = req.params
    res.send(await brandService.getBrandById(id))
  }

  async updateBrand(req: Request, res: Response) {
    const payload = req.body
    const { id } = req.params
    res.send(await brandService.updateBrand({ id, payload }))
  }

  async deleteBrand(req: Request, res: Response) {
    const { id } = req.params
    res.send(await brandService.deleteBrand(id))
  }
}

const brandController = new BrandController()
export default brandController
