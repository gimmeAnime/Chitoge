import { Schema, model } from "mongoose";
import { IPokemons } from "../../../typings";
const pokemonSchema = new Schema({
  jid: {
    type: String,
    required: true,
    unique: false,
  },
  pokemons: {
    type: [String],
  },
  party: [
    {
      id: Number,
      level: Number,
      name: String,
      image: String,
    },
  ],
  pc: [
    {
      id: Number,
      level: Number,
      name: String,
      image: String,
    },
  ],
  total: {
    type: Number,
    required: true,
    default: 0,
  },
});
export default model<IPokemons>("pokemons", pokemonSchema);
