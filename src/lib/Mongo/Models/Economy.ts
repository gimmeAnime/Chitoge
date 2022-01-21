import { Schema, model } from "mongoose";
import { IEconomy } from "../../../typings";
const economySchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  wallet: {
    type: Number,
    required: true,
    default: 0,
  },
  bank: {
    type: Number,
    required: true,
    default: 0,
  },
});
export default model<IEconomy>("economy", economySchema);
