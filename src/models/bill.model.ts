import mongoose, { InferSchemaType, Schema } from 'mongoose'

const billSchema = new Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'order'
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'VNPay'],
      default: 'Cash'
    },
    isPaid: {
      type: Boolean
    }
  },
  { timestamps: true }
)
const bill = mongoose.model('bills', billSchema)
type Bill = InferSchemaType<typeof billSchema>
export default bill
export type { Bill }
