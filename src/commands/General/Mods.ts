import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "mods",
      description: "Displays the Moderators' contact info",
      category: "general",
      usage: `${client.config.prefix}mods`,
      aliases: ["moderators", "mod", "owner"],
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    if (!this.client.config.mods || !this.client.config.mods[0])
      return void M.reply("*[UNMODERATED]*");
    const buffer = await this.client.getBuffer(
      `https://wallpapersmug.com/large/90e916/shooting-star-anime-girl-silhouette-art.jpg`
    );
    let text = "🌠 *Shooting Star Mods* 🌠\n\n";
    const mods = this.client.config.mods;
    for (let i = 0; i < mods.length; i++) {
      text += `*>@${mods[i].split("@")[0]}*\n`;
    }
    await this.client.sendMessage(M.from, text, MessageType.text, {
      quoted: M.WAMessage,
      contextInfo: {
        externalAdReply: {
          title: `🌠 Shooting Star 🌠`,
          thumbnail: buffer,
        },
        mentionedJid: [
          mods[0],
          mods[1],
          mods[2],
          mods[3],
          mods[4],
          mods[5],
          mods[6],
        ],
      },
    });
  };
}
