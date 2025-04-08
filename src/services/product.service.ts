import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import productModel, { type Product } from '@/models/product.model'
import orderModel from '@/models/order.model'
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'
class ProductService {
  async createProduct(data: { payload: Product; id: string }) {
    const newProduct = await productModel.create({
      ...data.payload,
      created_by: data.id
    })
    return new CreatedResponse('Product created successfully', newProduct)
  }

  async getProducts({
    category,
    price,
    page = 1,
    limit = 10
  }: {
    category?: string
    price?: string
    page?: number
    limit?: number
  }) {
    const query: any = {}

    if (category) {
      query.category_id = category
    }

    const sort: any = {}
    if (price === 'low') {
      sort.price = 1
    } else if (price === 'high') {
      sort.price = -1
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      productModel.find(query).sort(sort).skip(skip).limit(limit),
      productModel.countDocuments(query)
    ])

    if (!products || products.length === 0) {
      return new OkResponse('No products found with the specified filters', [])
    }

    return new OkResponse('Get products successfully', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: products
    })
  }

  async getProductById(id: string) {
    const product = await productModel.findById(id)
    if (!product) throw new BadRequestError('Sản phẩm không tồn tại')
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

  async searchProduct(code: string) {
    const products = await productModel
      .find({
        code: { $regex: code, $options: 'i' }
      })
      .limit(5)
    return new OkResponse('Tìm kiếm sản phẩm thành công', products)
  }

  async deleteManyProduct() {
    const products = await productModel.deleteMany()
    return new OkResponse('Xóa sản phẩm thành công', products)
  }
}

const productService = new ProductService()
export default productService
