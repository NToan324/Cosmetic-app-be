import mongoose, { InferSchemaType, Schema } from 'mongoose'

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
)

const categoryModel = mongoose.model('category', categorySchema)
type Category = InferSchemaType<typeof categorySchema>
export default categoryModel
export type { Category }
