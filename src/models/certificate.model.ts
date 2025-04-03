import mongoose from "mongoose";
const schema = mongoose.Schema;
const certificateSchema = new schema({
  title: String,
  description: String,
  urlImage: {
    type: String,
    required: true,
  },
  urlCertificate: String,
});

const certificate = mongoose.model("certificate", certificateSchema);
export default certificate;
