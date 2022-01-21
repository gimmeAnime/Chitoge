import { MessageType } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "leaderboard",
      description: "Displays the leaderboard",
      category: "general",
      usage: `${client.config.prefix}leaderboard || leaderboard --bank || leaderboard --wallet`,
      aliases: ["lb"],
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const terms = joined.trim().split(" ")[0].toLowerCase();
    let text = "";
    const buffer = await this.client.getBuffer(
      `https://wallpapersmug.com/large/90e916/shooting-star-anime-girl-silhouette-art.jpg`
    );
    if (terms === "--bank") {
      text += "👑 *BANK LEADERBOARD* 👑\n\n";
      await this.client.DB.gold
        .find({})
        .sort([["bank", "descending"]])
        .exec(async (err, res) => {
          if (err)
            return void M.reply(`An error occured. Please try again later.`);
          for (let i = 0; i < 10; i++) {
            const user = await this.client.getUser(res[i].jid);
            const pokemons = await (
              await this.client.getPokemons(res[i].jid)
            ).pokemons;
            const data = await this.client.getGold(res[i].jid);
            text += `*#${i + 1}*\n`;
            const exp = user.Xp;
            let role: string;
            if (exp < 500) {
              role = "🌸 Citizen";
            } else if (exp < 1000) {
              role = "🔎 Cleric";
            } else if (exp < 2000) {
              role = "🔮 Wizard";
            } else if (exp < 5000) {
              role = "♦️ Mage";
            } else if (exp < 10000) {
              role = "🎯 Noble";
            } else if (exp < 25000) {
              role = "✨ Elite";
            } else if (exp < 50000) {
              role = "🔶️ Ace";
            } else if (exp < 75000) {
              role = "🌀 Hero";
            } else if (exp < 100000) {
              role = "💎 Supreme";
            } else if (exp < 200000) {
              role = "❄️ Mystic";
            } else if (exp < 500000) {
              role = "❄️ Mystic II";
            } else {
              role = "🔆 Legendary";
            }
            text += `🏮 *Username: ${user.username}#${
              user.tag
            }*\n⭐ *Experience: ${exp || 0}*\n💫 *Role: ${role}*\n💰 *Gold: ${
              data.wallet + data.bank
            }*\n🏦 *Bank: ${data.bank}*\n🍀 *Total Pokemons: ${
              pokemons.length
            }*\n\n`;
          }
          return void M.reply(
            buffer,
            MessageType.image,
            undefined,
            undefined,
            text,
            undefined
          );
        });
    } else if (terms === "--wallet") {
      text += "👑 *WALLET LEADERBOARD* 👑\n\n";
      await this.client.DB.gold
        .find({})
        .sort([["wallet", "descending"]])
        .exec(async (err, res) => {
          if (err)
            return void M.reply(`An error occured. Please try again later.`);
          for (let i = 0; i < 10; i++) {
            const user = await this.client.getUser(res[i].jid);
            const pokemons = await (
              await this.client.getPokemons(res[i].jid)
            ).pokemons;
            const data = await this.client.getGold(res[i].jid);
            text += `*#${i + 1}*\n`;
            const exp = user.Xp;
            let role: string;
            if (exp < 500) {
              role = "🌸 Citizen";
            } else if (exp < 1000) {
              role = "🔎 Cleric";
            } else if (exp < 2000) {
              role = "🔮 Wizard";
            } else if (exp < 5000) {
              role = "♦️ Mage";
            } else if (exp < 10000) {
              role = "🎯 Noble";
            } else if (exp < 25000) {
              role = "✨ Elite";
            } else if (exp < 50000) {
              role = "🔶️ Ace";
            } else if (exp < 75000) {
              role = "🌀 Hero";
            } else if (exp < 100000) {
              role = "💎 Supreme";
            } else if (exp < 200000) {
              role = "❄️ Mystic";
            } else if (exp < 500000) {
              role = "❄️ Mystic II";
            } else {
              role = "🔆 Legendary";
            }
            text += `🏮 *Username: ${user.username}#${
              user.tag
            }*\n⭐ *Experience: ${exp || 0}*\n💫 *Role: ${role}*\n💰 *Gold: ${
              data.wallet + data.bank
            }*\n🏦 *Bank: ${data.bank}*\n🍀 *Total Pokemons: ${
              pokemons.length
            }*\n\n`;
          }
          return void M.reply(
            buffer,
            MessageType.image,
            undefined,
            undefined,
            text,
            undefined
          );
        });
    } else {
      text += "👑 *LEADERBOARD* 👑\n\n";
      await this.client.DB.user
        .find({})
        .sort([["Xp", "descending"]])
        .exec(async (err, res) => {
          if (err)
            return void M.reply(`An error occured. Please try again later.`);
          for (let i = 0; i < 10; i++) {
            const user = await this.client.getUser(res[i].jid);
            const pokemons = await (
              await this.client.getPokemons(res[i].jid)
            ).pokemons;
            const data = await this.client.getGold(res[i].jid);
            text += `*#${i + 1}*\n`;
            const exp = user.Xp;
            let role: string;
            if (exp < 500) {
              role = "🌸 Citizen";
            } else if (exp < 1000) {
              role = "🔎 Cleric";
            } else if (exp < 2000) {
              role = "🔮 Wizard";
            } else if (exp < 5000) {
              role = "♦️ Mage";
            } else if (exp < 10000) {
              role = "🎯 Noble";
            } else if (exp < 25000) {
              role = "✨ Elite";
            } else if (exp < 50000) {
              role = "🔶️ Ace";
            } else if (exp < 75000) {
              role = "🌀 Hero";
            } else if (exp < 100000) {
              role = "💎 Supreme";
            } else if (exp < 200000) {
              role = "❄️ Mystic";
            } else if (exp < 500000) {
              role = "❄️ Mystic II";
            } else {
              role = "🔆 Legendary";
            }
            text += `🏮 *Username: ${user.username}#${
              user.tag
            }*\n⭐ *Experience: ${exp || 0}*\n💫 *Role: ${role}*\n💰 *Gold: ${
              data.wallet + data.bank
            }*\n🏦 *Bank: ${data.bank}*\n🍀 *Total Pokemons: ${
              pokemons.length
            }*\n\n`;
          }

          return void M.reply(
            buffer,
            MessageType.image,
            undefined,
            undefined,
            text,
            undefined
          );
        });
    }
  };
}
