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
      default: 0,
      required: true
    },
    units: {
      type: String,
      enum: ['BOX', 'TUBE', 'PACK', 'PCS'],
      required: true
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
    },
    release_date: {
      type: Date,
      required: true,
      default: Date.now
    },
    discontinued_date: {
      type: Date
    }
  },
  { timestamps: true }
)

const product = mongoose.model('product', productSchema)
type Product = InferSchemaType<typeof productSchema>
export default product
export type { Product }
