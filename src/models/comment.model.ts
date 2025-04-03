import mongoose, { Schema, InferSchemaType } from "mongoose";
const commentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  urlImage: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
const comment = mongoose.model("comment", commentSchema);
type Comment = InferSchemaType<typeof commentSchema>;
export default comment;
export type { Comment };
