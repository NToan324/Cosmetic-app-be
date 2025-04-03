import mongoose, { InferSchemaType, Schema } from 'mongoose'

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    country: {
      type: String
    },
    logo_url: {
      type: String
    }
  },
  { timestamps: true }
)

const branch = mongoose.model('branch', branchSchema)
type Branch = InferSchemaType<typeof branchSchema>
export default branch
export type { Branch }
