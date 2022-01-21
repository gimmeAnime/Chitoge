/** @format */

import { Schema, model } from "mongoose";
import { IUserModel } from "../../../typings";
const UserSchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  ban: {
    type: Boolean,
    required: true,
    default: false,
  },
  tag: {
    type: String,
  },
  warnings: {
    type: Number,
    required: true,
    default: 0,
  },
  Xp: {
    type: Number,
    required: true,
    default: 0,
  },
  haigusha: {
    type: String,
    required: false,
    default: "None",
  },
  haigushaId: {
    type: Number,
    required: false,
    default: 0,
  },
  married: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastGamble: {
    type: Number,
  },
  lastBet: {
    type: Number,
  },
  answeredId: {
    type: Number,
  },
  inventory: {
    type: [String],
  },
  username: {
    type: String,
  },
});
export default model<IUserModel>("users", UserSchema);
