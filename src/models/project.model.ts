import mongoose, { Schema, InferSchemaType } from "mongoose";

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  urlImage: [
    {
      type: String,
      required: true,
    },
  ],
  totalTechnology: [String],
  totalFeature: [String],
  urlDemo: {
    type: String,
    required: true,
  },
  urlGithub: {
    type: String,
    required: true,
  },
});
const project = mongoose.model("project", projectSchema);
type Project = InferSchemaType<typeof projectSchema>;

export default project;
export type { Project };
