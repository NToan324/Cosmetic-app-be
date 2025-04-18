import mongoose, { InferSchemaType, Schema } from 'mongoose'

const employeeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['PARTTIME', 'FULLTIME'],
      default: 'FULLTIME'
    },
    disable: {
      type: Boolean,
      default: false
    },
    image_url: {
      type: String,
      default: '@/assets/images/default_avatar.jpg'
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    edit_history: [
      {
        edited_at: { type: Date, default: Date.now },
        edited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        reason: { type: String }
      }
    ],
  },
  { timestamps: true }
)

const employeeModel = mongoose.model('employee', employeeSchema)
export type Employee = InferSchemaType<typeof employeeSchema>
export default employeeModel
