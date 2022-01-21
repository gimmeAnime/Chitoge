/** @format */

import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import Canvacord from "canvacord";
import { MessageType } from "@adiwajshing/baileys";
import generate from "generate-unique-id";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "rank",
      description: "Displays User's Stats",
      category: "general",
      usage: `${client.config.prefix}rank [tag/quote]`,
      aliases: ["stats", "xp", "exp", "experience"],
      baseXp: 10,
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
    const w = "tag";
    let id!: string;
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
    const $ = [
      "#FFC0CB",
      "#00FFFF",
      "#008080",
      "#000080",
      "#FF00FF",
      "#800000",
      "#800080",
    ];
    const i = $[Math.floor(Math.random() * $.length)];
    const o = $[Math.floor(Math.random() * $.length)];
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let required: number;
    if (exp < 500) {
      required = 500;
    } else if (exp < 1000) {
      required = 1000;
    } else if (exp < 2000) {
      required = 2000;
    } else if (exp < 5000) {
      required = 5000;
    } else if (exp < 10000) {
      required = 10000;
    } else if (exp < 25000) {
      required = 25000;
    } else if (exp < 50000) {
      required = 50000;
    } else if (exp < 75000) {
      required = 75000;
    } else if (exp < 100000) {
      required = 100000;
    } else if (exp < 200000) {
      required = 100000;
    } else if (exp < 500000) {
      required = 300000;
    } else {
      required = 0;
    }
    const rank = new Canvacord.Rank()
      .setAvatar(pfp)
      .setCurrentXP(exp || 0)
      .setRequiredXP(required)
      .setStatus("online", false)
      .setLevel(0, "Level:", false)
      .setRank(0, `Role: ${role}`, false)
      .setProgressBar(i, "COLOR")
      .setOverlay("#FFFFFF")
      .setUsername(username)
      .setDiscriminator(id)
      .setBackground("COLOR", o);
    rank.build({}).then((rankcard) => {
      const text = `🏮 *Username: ${username}#${id}*\n\n⭐ *Experience: ${
        exp || 0
      } / ${required}*\n\n💫 *Role: ${role}*\n\n`;
      M.reply(
        rankcard,
        MessageType.image,
        undefined,
        undefined,
        text,
        undefined
      );
    });
  };
}
