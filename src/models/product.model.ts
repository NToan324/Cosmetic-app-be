import mongoose, { InferSchemaType, Schema } from 'mongoose'
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    stock_quantity: {
      type: Number,
      default: 0
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    },
    image_url: {
      type: String
    }
  },
  { timestamps: true }
)

const product = mongoose.model('product', productSchema)
type Product = InferSchemaType<typeof productSchema>
export default product
export type { Product }
