import mongoose, { InferSchemaType, Schema } from 'mongoose';

const brandSchema = new Schema(
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
);

const brand = mongoose.model('brand', brandSchema);
type Brand = InferSchemaType<typeof brandSchema>;
export default brand;
export type { Brand };