import mongoose, { InferSchemaType, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      required: true
    },
    role: [
      {
        type: String,
        enum: ['MANAGER', 'SALESTAFF', 'CONSULTANT', 'CUSTOMER'],
        default: 'CUSTOMER',
        required: true
      }
    ],
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, saltRounds)
  }
  next()
})

const userModel = mongoose.model('user', userSchema)
type User = InferSchemaType<typeof userSchema>

export default userModel
export type { User }
