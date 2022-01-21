import { Schema, model } from "mongoose";
import { ICountdown } from "../../../typings";
const cdSchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  haigusha: {
    type: Number,
  },
  answer: {
    type: Number,
  },
  marry: {
    type: Number,
  },
  divorce: {
    type: Number,
  },
  quiz: {
    type: Number,
  },
  claim: {
    type: Number,
  },
  catch: {
    type: Number,
  },
  withdraw: {
    type: Number,
  },
  deposit: {
    type: Number,
  },
  give: {
    type: Number,
  },
  lastRob: {
    type: Number,
  },
  daily: {
    type: Number,
  },
  weekly: {
    type: Number,
  },
  trade: {
    type: Number,
  },
  swap: {
    type: Number,
  },
});
export default model<ICountdown>("countdown", cdSchema);
