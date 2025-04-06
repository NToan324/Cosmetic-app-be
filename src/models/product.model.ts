import mongoose, { InferSchemaType, Schema } from 'mongoose';

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
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    image_url: { 
      type: String 
    },
    production_date: { 
      type: Date, 
      required: true 
    },
    expiration_date: { 
      type: Date, 
      required: true 
    },
    release_date: { 
      type: Date, 
      default: Date.now 
    },
    discontinued_date: { 
      type: Date, 
      default: null 
    },
    disable: {
      type: Boolean,
      default: false
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    edit_history: [
      {
        edited_at: { type: Date, default: Date.now },
        edited_by:{ type: String, required: true },// { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String, required: true },
        changes: { type: Schema.Types.Mixed, required: true },
      },
    ],
    deleted: { 
      type: Boolean, 
      default: false 
    },
  },  
  { timestamps: true }
);

const product = mongoose.model('product', productSchema);
type Product = InferSchemaType<typeof productSchema>;
export default product;
export type { Product };