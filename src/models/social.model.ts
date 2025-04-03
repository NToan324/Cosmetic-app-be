import mongoose from "mongoose";
const schema = mongoose.Schema;
const socialSchema = new schema({
  urlImage: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  socialName: {
    type: String,
    required: true,
  },
});

const social = mongoose.model("social", socialSchema);
export default social;
