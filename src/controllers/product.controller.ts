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
    const { category, price } = req.query as { category: string; price: string }
    console.log(category, price)
    res.send(await productService.getProducts({ category, price }))
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
}

const productController = new ProductController()
export default productController
