/** @format */

import { model, Schema } from "mongoose";
import { IGroupModel } from "../../../typings";

const GroupSchema = new Schema({
  // This is the id of the group
  jid: {
    type: String,
    required: true,
    unique: true,
  },
  // whether to enable the events for this group. Events are 'add' 'remove' events.
  events: {
    type: Boolean,
    required: false,
    default: false,
  },
  // whether to allow nsfw commands for this group.
  nsfw: {
    type: Boolean,
    required: false,
    default: false,
  },
  // TODO: NSFW checker.
  safe: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Remove people who post group links.
  mod: {
    type: Boolean,
    required: false,
    default: false,
  },
  // Are commands enabled for this group.
  cmd: {
    type: Boolean,
    required: false,
    default: true,
  },
  // Can people ask for Invite link of this group?
  invitelink: {
    type: Boolean,
    required: false,
    default: false,
  },

  gamblingforlife: {
    type: Boolean,
    required: false,
    default: false,
  },

  normal: {
    type: Boolean,
    required: false,
    default: true,
  },

  tsundere: {
    type: Boolean,
    required: false,
    default: false,
  },

  haigushaResponse: {
    type: String,
    required: false,
  },

  haigushaId: {
    type: Number,
    required: false,
  },

  claimable: {
    type: Boolean,
    required: false,
    default: false,
  },

  quizId: {
    type: Number,
    required: false,
    default: 0,
  },

  ongoing: {
    type: Boolean,
    required: false,
    default: false,
  },

  correct: {
    type: Number,
    required: false,
    default: 0,
  },

  wild: {
    type: Boolean,
    required: false,
    default: false,
  },

  charagame: {
    type: Boolean,
    required: false,
    default: false,
  },

  lastPokemon: {
    type: String,
    required: false,
  },

  pId: {
    type: Number,
    required: false,
  },

  pLevel: {
    type: Number,
    required: false,
  },

  pImage: {
    type: String,
    required: false,
  },

  catchable: {
    type: Boolean,
    required: false,
    default: false,
  },

  bot: {
    type: String,
    required: false,
    default: "Chitoge",
  },

  trade: {
    type: Boolean,
    required: false,
    default: false,
  },

  startedBy: {
    type: String,
  },

  tOffer: {
    name: {
      Type: String,
    },
    id: {
      type: Number,
    },
    level: {
      type: Number,
    },
    image: {
      type: String,
    },
  },

  tWant: {
    type: String,
  },

  cards: {
    type: Boolean,
    required: false,
    default: false,
  },

  cClaimable: {
    type: Boolean,
    required: false,
    default: false,
  },

  cId: {
    type: Number,
  },

  cName: {
    type: String,
  },

  cTier: {
    type: String,
  },

  cSource: {
    type: String,
  },

  cImage: {
    type: String,
  },

  cPrice: {
    type: Number,
  },
});

export default model<IGroupModel>("groups", GroupSchema);
