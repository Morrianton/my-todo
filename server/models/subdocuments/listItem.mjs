import mongoose from "mongoose";

const Schema = mongoose.Schema;

export default new Schema({
  description: {
    type: String,
    required: true,
  },
  prev_list_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  list_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
