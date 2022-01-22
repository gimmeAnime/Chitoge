import { model, Schema } from "mongoose";
import { ICard } from "../../../typings";
const cardsSchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: true,
  },

  deck: [
    {
      id: Number,
      name: String,
      tier: String,
      source: String,
      image: String,
    },
  ],
  collection: [
    {
      id: Number,
      name: String,
      tier: String,
      source: String,
      image: String,
    },
  ],
  cards: [
    {
      id: Number,
      name: String,
      tier: String,
      image: String,
    },
  ],
  tiers: {
    s: [
      {
        id: Number,
        name: String,
        tier: String,
        source: String,
        image: String,
      },
    ],
    six: [
      {
        id: Number,
        name: String,
        tier: String,
        source: String,
        image: String,
      },
    ],
    five: [
      {
        id: Number,
        name: String,
        tier: String,
        source: String,
        image: String,
      },
    ],
    four: [
      {
        id: Number,
        name: String,
        tier: String,
        source: String,
        image: String,
      },
    ],
    three: [
      {
        id: Number,
        name: String,
        tier: String,
        source: String,
        image: String,
      },
    ],
    two: [
      {
        id: Number,
        name: String,
        tier: String,
        source: String,
        image: String,
      },
    ],
    one: [
      {
        id: Number,
        name: String,
        tier: String,
        source: String,
        image: String,
      },
    ],
  },
});

export default model<ICard>("cards", cardsSchema);
