import mongoose, { InferSchemaType, Schema } from 'mongoose'

const customerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'user'
    },
    rank: {
      type: String,
      enum: ['MEMBER', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND', 'PLATINUM'],
      default: 'MEMBER'
    },
    point: {
      type: Number,
      default: 0
    },
    note: {
      type: String,
      default: ''
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    edit_history: [
      {
        edited_at: { type: Date, default: Date.now },
        edited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        reason: { type: String }
      }
    ]
  },
  { timestamps: true }
)

const customerModel = mongoose.model('customer', customerSchema)
export type Customer = InferSchemaType<typeof customerSchema>

export default customerModel
