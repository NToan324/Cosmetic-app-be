import mongoose, { InferSchemaType, Schema } from 'mongoose'
const customerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    role: {
      type: String,
      default: 'CUSTOMER'
    },
    rank: {
      type: String,
      enum: ['MEMBER', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND', 'PLATINUM']
    },
    point: {
      type: Number,
      default: 0
    },
    skin_type: {
      type: String
    },
    skin_issues: {
      type: String
    },
    age: {
      type: Number
    }
  },
  { timestamps: true }
)

const customer = mongoose.model('customer', customerSchema)
export type Customer = InferSchemaType<typeof customerSchema>

export default customer
