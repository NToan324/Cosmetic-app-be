import mongoose, { InferSchemaType, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const user = mongoose.model('user', userSchema);
type User = InferSchemaType<typeof userSchema>;

export default user;
export type { User };