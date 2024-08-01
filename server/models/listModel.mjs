// Libraries
import mongoose from "mongoose";

// Subdocuments
import listItemSchema from "./subdocuments/listItem.mjs";

const Schema = mongoose.Schema;

const listSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  completed_items: {
    type: [listItemSchema],
    required: true,
    default: () => ([]),
  },
  uncompleted_items: {
    type: [listItemSchema],
    required: true,
    default: () => ([]),
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('List', listSchema);
