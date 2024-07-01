import mongoose from "mongoose";

const Schema = mongoose.Schema;

export default new Schema({
  description: {
    type: String,
    required: true,
  },
});
