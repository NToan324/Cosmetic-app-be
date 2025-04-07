import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import productModel, { type Product } from '@/models/product.model'
import orderModel from '@/models/order.model'
import { convertToObjectId } from '@/helpers/convertObjectId'
class ProductService {
  async createProduct(data: { payload: Product; id: string }) {
    const newProduct = await productModel.create({
      ...data.payload,
      created_by: data.id
    })
    return new CreatedResponse('Product created successfully', newProduct)
  }

  async getProducts() {
    const products = await productModel.find()
    return new OkResponse('Get all products successfully', products)
  }

  async getProductById(id: string) {
    const product = await productModel.findById(id)
    if (!product) throw new Error('Sản phẩm không tồn tại')
    return new OkResponse('Get product successfully', product)
  }

  async deleteProduct(id: string) {
    const isSoldProduct = await orderModel.findOne({ 'items.product_id': convertToObjectId(id), status: 'Completed' })
    if (isSoldProduct) {
      throw new Error('Sản phẩm đã được bán không thể xóa')
    }

    const product = await productModel.findByIdAndDelete(id)
    if (!product) throw new Error('Sản phẩm không tồn tại')
    return new OkResponse('Xóa sản phẩm thành công', product)
  }
}

const productService = new ProductService()
export default productService
