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
      type: Boolean,
      default: false
    },
    total_amount: {
      type: Number,
      required: true
    },
    paid_at: {
      type: Date
    },
    transaction_id: {
      type: String
    },
    note: {
      type: String
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  { timestamps: true }
)

const billModel = mongoose.model('bills', billSchema)
type Bill = InferSchemaType<typeof billSchema>
export default billModel
export type { Bill }
