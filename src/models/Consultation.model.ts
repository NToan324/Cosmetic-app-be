import mongoose, { InferSchemaType, Schema } from 'mongoose'
const consultationSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    consultation_content: {
      type: String
    },
    recommended_products: {
      type: String
    },
    consultation_date: {
      type: Date
    }
  },
  { timestamps: true }
)

const consultation = mongoose.model('consultation', consultationSchema)
type Consultation = InferSchemaType<typeof consultationSchema>
export default consultation
export type { Consultation }
