import mongoose, { Schema, InferSchemaType } from "mongoose";

const technologySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  urlImage: {
    type: String,
    required: true,
  },
});
const technology = mongoose.model("technology", technologySchema);
type Technology = InferSchemaType<typeof technologySchema>;
export default technology;
export { Technology };
