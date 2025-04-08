import productService from '@/services/product.service'
import type { Request, Response } from 'express'

class ProductController {
  //Thêm sản phẩm
  async createProduct(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const payload = req.body
    res.send(await productService.createProduct({ payload, id }))
  }

  async getProducts(req: Request, res: Response) {
    const {
      category,
      price,
      page = '1',
      limit = '10'
    } = req.query as {
      category?: string
      price?: string
      page?: string
      limit?: string
    }

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    res.send(
      await productService.getProducts({
        category,
        price,
        page: pageNumber,
        limit: limitNumber
      })
    )
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params
    res.send(await productService.getProductById(id))
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params
    res.send(await productService.deleteProduct(id))
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.user as { id: string }
    const productId = req.params.id
    const payload = req.body
    res.send(await productService.updateProduct({ payload, id, productId }))
  }

  async searchProduct(req: Request, res: Response) {
    const { code } = req.query as { code: string }
    res.send(await productService.searchProduct(code))
  }

  async deleteManyProduct(req: Request, res: Response) {
    res.send(await productService.deleteManyProduct())
  }
}

const productController = new ProductController()
export default productController
