import mongoose, { InferSchemaType, Schema } from 'mongoose'
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'Staff', 'Customer'],
      default: 'Customer'
    },
    phone: {
      type: String,
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
