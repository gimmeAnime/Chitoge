/** @format */

import { MessageType } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import request from "../../lib/request";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import generate from "generate-unique-id";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "profile",
      description: "Displays user-profile 📜",
      category: "general",
      usage: `${client.config.prefix}profile [tag/quote]`,
      aliases: ["p", "pf"],
      baseXp: 30,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    if (M.quoted?.sender) M.mentioned.push(M.quoted.sender);
    const user = M.mentioned[0] ? M.mentioned[0] : M.sender.jid;
    let username = user === M.sender.jid ? M.sender.username : "";
    if (!username) {
      const contact = this.client.getContact(user);
      username =
        contact.notify || contact.vname || contact.name || user.split("@")[0];
    }
    const data = await (await this.client.getPokemons(user)).pokemons;
    const i = await (await this.client.getPokemons(user)).party;
    let companion;
    if (i.length < 1) {
      companion = "None";
    } else {
      companion = i[0].name;
    }
    const w = "tag";
    let id;
    if ((await (await this.client.getUser(user)).tag) === undefined) {
      id = await generate({
        length: 4,
        useLetters: false,
      });
      await this.client.DB.user.updateOne({ jid: user }, { $set: { [w]: id } });
    } else if ((await (await this.client.getUser(user)).tag) !== undefined) {
      id = await (await this.client.getUser(user)).tag;
    }
    let pfp: string;
    try {
      pfp = await this.client.getProfilePicture(user);
    } catch (err) {
      M.reply(`Profile Picture not Accessible of ${username}`);
      pfp =
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
    }
    const exp = (await this.client.getUser(user)).Xp;
    let haigusha;
    if (await (await this.client.getHaigusha(user)).married) {
      haigusha = await (await this.client.getHaigusha(user)).haigusha;
    } else if (await !(await this.client.getHaigusha(user)).married) {
      haigusha = "None";
    }

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

    await M.reply(
      await request.buffer(
        pfp || "https://wallpaperaccess.com/full/5304840.png"
      ),
      MessageType.image,
      undefined,
      undefined,
      `🏮 *Username: ${username}#${id}*\n\n🎗️ *About: ${
        (await this.client.getStatus(user)).status || "None"
      }*\n\n💙 *Haigusha: ${haigusha}*\n\n⭐ *Experience: ${
        exp || 0
      }*\n\n💫 *Role: ${role}*\n\n🧣 *Companion: ${this.client.util.capitalize(
        companion
      )}*\n\n🍀 *Total Pokemons: ${data.length}*\n\n👑 *Admin: ${
        M.groupMetadata?.admins?.includes(user) || false
      }*\n\n✖ *Ban: ${(await this.client.getUser(user)).ban || false}*`
    );
  };
}
