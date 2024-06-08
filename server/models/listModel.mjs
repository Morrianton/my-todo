import mongoose from "mongoose";

const Schema = mongoose.Schema;

const listSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  owner_id: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('List', listSchema);
