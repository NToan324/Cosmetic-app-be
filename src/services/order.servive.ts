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
            const isEmployee = await employeeModel.findOne({ userId: creator._id })
            if (isEmployee) {
              createdBy = creator.name
            } else {
              createdBy = 'Không có'
            }
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
    //create code
    const order_id = generateOrderCode()

    //Nếu thanh toán bằng ngân hàng thì cần tạo đơn trước
    if (paymentMethod === 'VNPay') {
      // Tạo order
      const newOrder = await orderModel.create({
        order_id: order_id,
        user_id: userId || null,
        items,
        discount_point,
        status: 'Awaiting Payment',
        total_price: totalPrice
      })
      const bill = await billModel.create({
        order_id: newOrder._id,
        isPaid: false,
        total_amount: totalPrice,
        created_by: createdBy || null,
        payment_method: paymentMethod || 'Cash'
      })
      return new CreatedResponse('Create order successfully', {
        order: newOrder,
        bill
      })
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

  async updateOrder(
    payload: { createdBy: string; paymentMethod: string; total_amount: number; status: string },
    orderId: string
  ) {
    const { createdBy, paymentMethod, total_amount, status } = payload
    const foundOrder = await orderModel.findOne({ order_id: orderId })

    if (!foundOrder) {
      throw new BadRequestError('Order not found')
    }

    if (foundOrder.status === 'Completed') {
      throw new BadRequestError('Order already completed')
    }

    if (status === 'Canceled') {
      foundOrder.status = 'Canceled'
      //Cộng lại số lượng sản phẩm
      for (const item of foundOrder.items) {
        const product = await productModel.findById(item.product_id)
        if (!product) {
          throw new BadRequestError('Product not found')
        }
        product.stock_quantity += item.quantity
        await product.save()
      }
      await foundOrder.save()

      //Update bill
      const foundBill = await billModel.findOne({ order_id: foundOrder._id })
      if (foundBill) {
        foundBill.isPaid = false
        foundBill.total_amount = 0
        foundBill.paid_at = null
        if (paymentMethod === 'Cash' || paymentMethod === 'VNPay') {
          foundBill.payment_method = paymentMethod
        } else {
          throw new BadRequestError('Invalid payment method')
        }
        await foundBill.save()
      }
      return new CreatedResponse('Đơn hàng đã bị hủy', {
        order: foundOrder
      })
    }

    // Cập nhật đơn hàng
    foundOrder.status = 'Completed'
    foundOrder.total_price = total_amount
    await foundOrder.save()

    const userId = foundOrder.user_id?.toString()

    // Cập nhật điểm và rank nếu có user
    if (userId) {
      const foundUser = await customerModel.findOne({ userId: convertToObjectId(userId) })
      if (!foundUser) {
        throw new BadRequestError('User not found')
      }

      // Trừ điểm nếu có sử dụng discount_point
      if (foundOrder.discount_point > 0) {
        if (foundUser.point < foundOrder.discount_point) {
          throw new BadRequestError('User does not have enough points')
        }
        foundUser.point -= foundOrder.discount_point
      }

      // Cộng điểm thưởng
      foundUser.point += foundOrder.items.reduce((acc, item) => acc + item.price * item.quantity * 0.015, 0)

      // Cập nhật rank
      const rank = await rankModel.findOne({
        min_points: { $lte: foundUser.point },
        max_points: { $gte: foundUser.point }
      })

      if (rank) {
        foundUser.rank = rank.rank_name
      }

      await foundUser.save()
    }

    // Cập nhật shift nếu là nhân viên
    if (isValidObjectId(createdBy)) {
      const isEmployee = await employeeModel.findOne({ userId: convertToObjectId(createdBy) })
      if (isEmployee) {
        const foundShift = await shiftModel.findOne({
          employee_id: convertToObjectId(createdBy),
          is_closed: false
        })
        if (!foundShift) {
          throw new BadRequestError('Vui lòng mở ca trước khi cập nhật đơn hàng')
        }

        foundShift.order_count += 1
        foundShift.current_cash += total_amount
        if (paymentMethod === 'Cash') {
          foundShift.cash_revenue += total_amount
        } else {
          foundShift.transfer_revenue += total_amount
        }

        await foundShift.save()
      }
    }

    // Update bill
    const bill = await billModel.findOne({ order_id: foundOrder._id })
    if (!bill) {
      throw new BadRequestError('Bill not found')
    }
    bill.isPaid = true
    bill.total_amount = total_amount
    bill.paid_at = new Date()
    if (paymentMethod === 'Cash' || paymentMethod === 'VNPay') {
      bill.payment_method = paymentMethod
    } else {
      throw new BadRequestError('Invalid payment method')
    }
    await bill.save()

    return new CreatedResponse('Cập nhật đơn hàng thành công', {
      order: foundOrder,
      bill
    })
  }

  async searchOrderByFilters(filters: { orderId?: string; customerName?: string; phone?: string }) {
    const query: Record<string, any> = {}

    // Tìm theo order_id (nếu có)
    if (filters.orderId) {
      query.order_id = { $regex: filters.orderId, $options: 'i' }
    }

    // Tìm theo customerName hoặc phone thông qua user
    if (filters.customerName || filters.phone) {
      const userQuery: Record<string, any> = {}

      if (filters.customerName) {
        userQuery.name = { $regex: filters.customerName, $options: 'i' }
      }

      if (filters.phone) {
        userQuery.phone = { $regex: filters.phone, $options: 'i' }
      }

      const users = await userModel.find(userQuery).select('_id').lean()
      const userIds = users.map((user) => user._id)

      // Nếu không tìm thấy user nào thì trả về mảng rỗng luôn
      if (userIds.length === 0) {
        return new OkResponse('OK', [])
      }

      query.user_id = { $in: userIds }
    }

    const orders = await orderModel
      .find(query)
      .populate('user_id', 'name phone') // lấy thêm tên/sđt khách
      .lean()

    return new OkResponse('OK', orders)
  }
}

const orderService = new OrderService()
export default orderService
