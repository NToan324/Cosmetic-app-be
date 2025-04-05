import mongoose, { InferSchemaType, Schema } from 'mongoose'
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true
    },
    role: [
      {
        type: String,
        enum: ['MANAGER', 'SALESTAFF', 'CONSULTANT', 'CUSTOMER'],
        default: 'CUSTOMER'
      }
    ],
    type: {
      type: String,
      enum: ['PARTTIME', 'FULLTIME']
    },
    skin_type: {
      type: String
    },
    skin_issues: {
      type: String
    },
    age: {
      type: Number
    },
    active: {
      type: Boolean,
    }
  },
  { timestamps: true }
)

const user = mongoose.model('user', userSchema)
type User = InferSchemaType<typeof userSchema>

export default user
export type { User }
