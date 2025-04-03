import mongoose, { InferSchemaType, Schema } from 'mongoose'
const orderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
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
          type: Number
        }
      }
    ],
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
const order = mongoose.model('orders', orderSchema)
type Order = InferSchemaType<typeof orderSchema>
export default order
export type { Order }
