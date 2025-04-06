import mongoose, { InferSchemaType, Schema } from 'mongoose'
const employeeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['PARTTIME', 'FULLTIME']
    }
  },
  { timestamps: true }
)

const employee = mongoose.model('employee', employeeSchema)
export type Employee = InferSchemaType<typeof employeeSchema>

export default employee
