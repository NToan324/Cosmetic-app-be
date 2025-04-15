import mongoose, { InferSchemaType, Schema } from 'mongoose'
const orderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: null
    },
    order_id: {
      type: String,
      required: true,
      unique: true
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    discount_point: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Awaiting Payment', 'Completed', 'Canceled'],
      default: 'Pending'
    },
    total_price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)
const orderModel = mongoose.model('orders', orderSchema)
type Order = InferSchemaType<typeof orderSchema>
export default orderModel
export type { Order }
