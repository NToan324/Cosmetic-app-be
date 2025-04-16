import mongoose, { Schema, InferSchemaType } from 'mongoose'

const shiftSchema = new Schema(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    opening_cash: {
      type: Number,
      required: true
    },
    current_cash: {
      type: Number,
      default: 0
    },
    actual_cash: {
      type: Number
    },
    cash_revenue: {
      type: Number,
      default: 0
    },
    transfer_revenue: {
      type: Number,
      default: 0
    },
    order_count: {
      type: Number,
      default: 0
    },
    start_time: {
      type: Date,
      default: Date.now
    },
    end_time: {
      type: Date
    },
    is_closed: {
      type: Boolean,
      default: false
    },
    is_approved: {
      type: Boolean,
      default: false
    },
    note: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const shiftModel = mongoose.model('shifts', shiftSchema)
type Shift = InferSchemaType<typeof shiftSchema>
export default shiftModel
export type { Shift }
