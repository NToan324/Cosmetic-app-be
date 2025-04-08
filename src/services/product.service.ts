import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import productModel, { type Product } from '@/models/product.model'
import orderModel from '@/models/order.model'
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'
import { console } from 'inspector'
class ProductService {
  async createProduct(data: { payload: Product; id: string }) {
    const newProduct = await productModel.create({
      ...data.payload,
      created_by: data.id
    })
    return new CreatedResponse('Product created successfully', newProduct)
  }

  async getProducts({ category, price }: { category?: string; price?: string }) {
    const query: any = {}

    // Lọc theo category nếu có
    if (category) {
      query.category_id = category
    }

    // Lọc theo price nếu có
    if (price) {
      if (price === 'low') {
        // Sắp xếp giá từ thấp đến cao
        const products = await productModel.find(query).sort({ price: 1 })
        if (!products || products.length === 0) {
          return new OkResponse('No products found with the specified price filter', [])
        }
        return new OkResponse('Get products successfully', products)
      } else if (price === 'high') {
        // Sắp xếp giá từ cao đến thấp
        const products = await productModel.find(query).sort({ price: -1 })
        if (!products || products.length === 0) {
          return new OkResponse('No products found with the specified price filter', [])
        }
        return new OkResponse('Get products successfully', products)
      }
    }

    // Nếu không có bộ lọc giá, lấy tất cả sản phẩm theo category (nếu có)
    const products = await productModel.find(query)
    if (!products || products.length === 0) {
      return new OkResponse('No products found with the specified filters', [])
    }

    return new OkResponse('Get products successfully', products)
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

  async updateProduct({ payload, id, productId }: { payload: Product; id: string; productId: string }) {
    const updatedProduct = await productModel.findByIdAndUpdate(
      { _id: convertToObjectId(productId) },
      {
        ...payload,
        updated_by: id
      },
      { new: true }
    )

    if (!updatedProduct) throw new BadRequestError('Sản phẩm không tồn tại')
    return new OkResponse('Cập nhật sản phẩm thành công', updatedProduct)
  }
}

const productService = new ProductService()
export default productService
