import { Schema, model } from "mongoose";
import { IHaigusha } from "../../../typings";
const haigushaSchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  haigusha: {
    type: String,
    required: true,
    default: "None",
  },
  haigushaId: {
    type: Number,
    required: true,
    default: 0,
  },
  married: {
    type: Boolean,
    required: true,
    default: false,
  },
});
export default model<IHaigusha>("haigusha", haigushaSchema);
