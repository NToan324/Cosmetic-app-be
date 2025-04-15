import { Role } from '@/constants'
import { BadRequestError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import { convertToObjectId, generateOrderCode } from '@/helpers/convertObjectId'
import billModel from '@/models/bill.model'
import customerModel from '@/models/customer.model'
import employeeModel from '@/models/employee.model'
import orderModel, { Order } from '@/models/order.model'
import productModel from '@/models/product.model'
import rankModel from '@/models/rank.model'
import shiftModel from '@/models/shift.model'
import userModel, { User } from '@/models/user.model'
import { isValidObjectId } from 'mongoose'

class OrderService {
  async getOrders(
    user: {
      id: string
      role: Role[]
    },
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit
    const isCustomer = user.role.includes(Role.CUSTOMER)

    const query = isCustomer ? { user_id: user.id } : {}

    const [orders, total] = await Promise.all([
      orderModel.find(query).skip(skip).limit(limit).lean(),
      orderModel.countDocuments(query)
    ])

    const results = await Promise.all(
      orders.map(async (order) => {
        // Tìm khách hàng (nếu có)
        const customer = await userModel.findById(order.user_id).lean()
        const customerName = customer?.name || 'Khách vãng lai'
        const phoneNumber = customer?.phone || 'Không có'

        // Tìm bill để lấy người tạo
        let createdBy = 'Không có'
        let payment_method = 'Cash'
        const bill = await billModel.findOne({ order_id: order._id }).lean()
        if (bill) {
          const creator = await userModel.findById(bill.created_by).lean()
          if (creator) {
            createdBy = creator.name
          }
          payment_method = bill.payment_method || 'Cash'
        }

        // Tìm thông tin sản phẩm
        const items = await Promise.all(
          order.items.map(async (item) => {
            const product = await productModel.findById(item.product_id).lean()
            return product
              ? {
                  productId: product.code.toString(),
                  productName: product.name,
                  quantity: item.quantity,
                  price: item.price
                }
              : null
          })
        )

        return {
          _id: order._id.toString(),
          orderId: order.order_id,
          customerName,
          phoneNumber,
          createdAt: order.createdAt.toISOString(),
          status: order.status,
          totalPrice: order.total_price,
          discount_point: order.discount_point,
          payment_method,
          createdBy,
          items: items.filter(Boolean)
        }
      })
    )

    return new OkResponse('OK', {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: results
    })
  }

  async deleteAllOrder() {
    Promise.all([orderModel.deleteMany({}), billModel.deleteMany({})])
    return new CreatedResponse('Delete all order successfully', {})
  }

  async createOrder(payload: { userId: string; createdBy: string; paymentMethod: string; order: Order }) {
    const userId = payload.userId
    const createdBy = payload.createdBy
    const paymentMethod = payload.paymentMethod
    const { discount_point, items } = payload.order

    // Tính tổng giá trị đơn hàng
    if (!items || items.length === 0) {
      throw new BadRequestError('Không có sản phẩm nào trong đơn hàng')
    }
    const totalPriceForItem = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    let totalPrice = totalPriceForItem
    if (discount_point > 0) {
      totalPrice = totalPriceForItem - discount_point
    }
    // Nếu có khách hàng (đặt đơn với tài khoản)
    if (userId) {
      const foundUser = await customerModel.findOne({ userId: convertToObjectId(userId) })
      if (!foundUser) {
        throw new BadRequestError('User not found')
      }

      // Kiểm tra đủ điểm
      if (foundUser.point < discount_point) {
        throw new BadRequestError('Discount point is not enough')
      }

      // Trừ điểm và cập nhật rank
      if (discount_point > 0) {
        foundUser.point -= discount_point

        // Tìm rank mới
        const rank = await rankModel.findOne({
          min_points: { $lte: foundUser.point },
          max_points: { $gte: foundUser.point }
        })

        if (rank) {
          foundUser.rank = rank.rank_name
        }

        await foundUser.save()
      }
      foundUser.point += totalPriceForItem * 0.015 // Thêm điểm thưởng 1,5% cho đơn hàng
      await foundUser.save()
    }

    // Trừ số lượng sản phẩm
    for (const item of items) {
      const product = await productModel.findById(item.product_id)
      if (!product) {
        throw new BadRequestError('Product not found')
      }
      if (product.stock_quantity < item.quantity) {
        throw new BadRequestError('Not enough product quantity')
      }
      product.stock_quantity -= item.quantity
      await product.save()
    }

    //Lưu số đơn hàng vào bảng shift
    if (isValidObjectId(createdBy)) {
      //check id có phải nhân viên hay không
      const isEmployee = await employeeModel.findOne({ userId: convertToObjectId(createdBy) })
      if (isEmployee) {
        //check ca làm có đang mở hay không
        const foundShift = await shiftModel.findOne({ employee_id: convertToObjectId(createdBy), is_closed: false })
        if (!foundShift) {
          throw new BadRequestError('Vui lòng mở ca trước khi tạo đơn hàng')
        }
        // Tăng số lượng đơn hàng trong ca
        foundShift.order_count += 1
        foundShift.current_cash += totalPrice
        if (paymentMethod === 'Cash') {
          foundShift.cash_revenue += totalPrice
        }
        if (paymentMethod === 'VNPay') {
          foundShift.transfer_revenue += totalPrice
        }
        await foundShift.save()
      }
    }

    //create code
    const order_id = generateOrderCode()

    // Tạo order
    const newOrder = await orderModel.create({
      order_id: order_id,
      user_id: userId || null,
      items,
      discount_point,
      status: 'Completed',
      total_price: totalPrice
    })

    // Tạo bill
    const bill = await billModel.create({
      order_id: newOrder._id,
      isPaid: true,
      total_amount: totalPrice,
      paid_at: new Date(),
      created_by: createdBy || null,
      payment_method: paymentMethod || 'Cash'
    })

    return new CreatedResponse('Create order successfully', {
      order: newOrder,
      bill
    })
  }

  async getOrderById(id: string) {
    let infomation: {
      _id: string
      orderId: string
      customerName: string
      createdAt: string
      status: string
      totalPrice: number
      payment_method: string
      discount_point: number
      createdBy: string
      items: { productId: string; productName: string; quantity: number; price: number }[]
    } = {
      _id: '',
      orderId: '',
      customerName: '',
      payment_method: '',
      createdAt: '',
      status: '',
      totalPrice: 0,
      discount_point: 0,
      createdBy: '',
      items: []
    }
    //check indentify
    const foundOrder = await orderModel.findOne({ order_id: id })
    if (!foundOrder) {
      throw new BadRequestError('Order not found')
    }
    //get customer name
    const foundUser = await userModel.findById(foundOrder.user_id)
    if (foundUser) {
      infomation.customerName = foundUser.name
    } else {
      infomation.customerName = 'Khách vãng lai'
    }

    //get created by
    const foundCreatedBy = await billModel.findOne({ order_id: foundOrder._id })
    if (foundCreatedBy) {
      const foundUser = await userModel.findById(foundCreatedBy.created_by)
      if (foundUser) {
        infomation.createdBy = foundUser.name
      } else {
        infomation.createdBy = 'Khách vãng lai'
      }
    }

    //get items
    for (const item of foundOrder.items) {
      const foundProduct = await productModel.findById(item.product_id)
      if (!foundProduct) {
        throw new BadRequestError('Product not found')
      }
      infomation.items.push({
        productId: foundProduct._id.toString(),
        productName: foundProduct.name,
        quantity: item.quantity,
        price: item.price
      })
    }

    infomation._id = foundOrder._id.toString()
    infomation.orderId = foundOrder._id.toString()
    infomation.createdAt = foundOrder.createdAt.toString()
    infomation.status = foundOrder.status
    infomation.totalPrice = foundOrder.total_price
    infomation.payment_method = foundCreatedBy?.payment_method || 'Cash'
    infomation.discount_point = foundOrder.discount_point

    return new OkResponse('OK', infomation)
  }
}

const orderService = new OrderService()
export default orderService
