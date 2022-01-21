/** @format */

import { WAGroupMetadata } from "@adiwajshing/baileys";

export * from "./message";
export * from "./command";
export * from "./mongo";
export interface IConfig {
  name: string;
  mods?: string[];
  prefix: string;
  session: string;
  mods: string[];
  gkey: string;
  chatBotUrl: string;
  gifApi: string;
  geniusKey: string;
  malUsername: string;
  malPassword: string;
}

export interface IParsedArgs {
  args: string[];
  flags: string[];
  joined: string;
}

export interface IExtendedGroupMetadata extends WAGroupMetadata {
  admins?: string[];
}

export interface ISession {
  clientID: string;
  serverToken: string;
  clientToken: string;
  encKey: string;
  macKey: string;
}

export interface IGroup {
  jid: string;
  events: boolean;
  nsfw: boolean;
  safe: boolean;
  mod: boolean;
  cmd: boolean;
  invitelink: boolean;
  gamblingforlife: boolean;
  news: boolean;
  normal: boolean;
  tsundere: boolean;
  haigushaResponse: string;
  haigushaId: number;
  claimable: boolean;
  quizId: number;
  ongoing: boolean;
  correct: number;
  wild: boolean;
  charagame: boolean;
  lastPokemon: string;
  pId: number;
  pLevel: number;
  pImage: string;
  catchable: boolean;
  bot: string;
  trade: boolean;
  startedBy: string;
  tOffer: {
    name: string;
    id: number;
    level: number;
    image: string;
  };
  tWant: string;
}

export interface IUser {
  jid: string;
  ban: boolean;
  tag: string;
  warnings: number;
  Xp: number;
  lastGamble: number;
  lastBet: number;
  answeredId: number;
  inventory: string[];
  username: string;
}

export interface ICountdown {
  jid: string;
  haigusha: number;
  answer: number;
  marry: number;
  divorce: number;
  quiz: number;
  claim: number;
  catch: number;
  withdraw: number;
  deposit: number;
  give: number;
  lastRob: number;
  daily: number;
  weekly: number;
  trade: number;
  swap: number;
}

export interface IPokemons {
  jid: string;
  pokemons: string[];
  party: [
    {
      id: number;
      level: number;
      name: string;
      image: string;
    }
  ];
  pc: [
    {
      id: number;
      level: number;
      name: string;
      image: string;
    }
  ];
}

export interface IHaigusha {
  jid: string;
  haigusha: string;
  haigushaId: number;
  married: boolean;
}

export interface IEconomy {
  jid: string;
  wallet: number;
  bank: number;
}

export interface IFeature {
  feature: string;
  state: boolean;
  jids: string[];
}

export interface IPackage {
  description: string;
  dependencies: { [key: string]: string };
  homepage: string;
  repository: {
    url: string;
  };
}
