import mongoose, { Schema, InferSchemaType } from 'mongoose'

const rankSchema = new Schema(
  {
    rank_name: {
      type: String,
      enum: ['MEMBER', 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND', 'PLATINUM'],
      required: true
    },
    min_points: {
      type: Number,
      required: true
    },
    max_points: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

const rankModel = mongoose.model('rank', rankSchema)
export type Rank = InferSchemaType<typeof rankSchema>
export default rankModel
