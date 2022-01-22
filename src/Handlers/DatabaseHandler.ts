import { IDBModels } from "../typings";
import UserModel from "../lib/Mongo/Models/User";
import GroupModel from "../lib/Mongo/Models/Group";
import SessionModel from "../lib/Mongo/Models/Session";
import DisabledCommandsModel from "../lib/Mongo/Models/DisabledCommands";
import IFeatureModel from "../lib/Mongo/Models/Features";
import haigushaModel from "../lib/Mongo/Models/HaigushA";
import pokemonModel from "../lib/Mongo/Models/Pokemons";
import cdModel from "../lib/Mongo/Models/Countdown";
import economyModel from "../lib/Mongo/Models/Economy";
import cardsModel from "../lib/Mongo/Models/Card";

export default class DatabaseHandler implements IDBModels {
  user = UserModel;
  group = GroupModel;
  session = SessionModel;
  disabledcommands = DisabledCommandsModel;
  feature = IFeatureModel;
  haigusha = haigushaModel;
  pokemons = pokemonModel;
  cd = cdModel;
  gold = economyModel;
  card = cardsModel;
}
