/** @format */

import { MessageType } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import request from "../../lib/request";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import axios from "axios";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "hg",
      description: "Displays user haigusha",
      category: "general",
      usage: `${client.config.prefix}hg [tag/quote]`,
      aliases: ["sp"],
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
    if (await !(await this.client.getHaigusha(user)).married)
      return void M.reply(
        `*@${user.split("@")[0]}* isn't married to any haigusha.`,
        MessageType.text,
        undefined,
        [user]
      );
    setTimeout(async () => {
      const id = await (await this.client.getHaigusha(user)).haigushaId;
      const haigusha = await axios.get(
        `https://api.jikan.moe/v3/character/${id}`
      );
      console.log(haigusha);
      let text = "";
      text += `💙 *Name: ${haigusha.data.name}*\n\n`;
      if (haigusha.data.kanji_name !== null)
        text += `💚 *Original Name: ${haigusha.data.name_kanji}*\n\n`;
      if (haigusha.data.nicknames.length > 0)
        text += `🖤 *Nicknames: ${haigusha.data.nicknames.join(", ")}*\n\n`;
      text += `❤️‍🩹 *Married to: ${username}*\n\n`;
      text += `💛 *Source: ${haigusha.data.animeography[0].name}*\n\n`;
      text += `❤ *Description:* ${haigusha.data.about}`;
      const buffer = await request.buffer(haigusha.data.image_url);
      await this.client.sendMessage(M.from, buffer, MessageType.image, {
        caption: text,
        contextInfo: {
          externalAdReply: {
            body: `${haigusha.data.about}`,
            mediaType: 0,
            mediaUrl: haigusha.data.url,
            sourceUrl: haigusha.data.url,
            thumbnail: buffer,
            title: haigusha.data.name,
          },
        },
      });
    }, 3000);
  };
}
