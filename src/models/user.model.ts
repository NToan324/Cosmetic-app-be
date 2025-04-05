import mongoose, { InferSchemaType, Schema } from 'mongoose'
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String
    },
    role: {
      type: String,
      enum: ['Admin', 'Staff', 'Customer'],
      default: 'Customer'
    },
    phone: {
      type: String,
      unique: true,
      required: true
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

const user = mongoose.model('user', userSchema)
type User = InferSchemaType<typeof userSchema>

export default user
export type { User }
