/** @format */

import { TraceMoe } from "trace.moe.ts";
import anilist from "anilist-node";
import { MessageType, Mimetype } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { SauceNao } from "gimme-sand";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "sauce",
      description: `Gives you the source of the given anime scene.`,
      aliases: ["trace", "source"],
      category: "weeb",
      usage: `${client.config.prefix}sauce [tag_image]`,
      baseXp: 50,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    /*eslint-disable @typescript-eslint/no-unused-vars*/
    let buffer;
    if (M.quoted?.message?.message?.imageMessage)
      buffer = await this.client.downloadMediaMessage(M.quoted.message);
    else if (M.WAMessage.message?.imageMessage)
      buffer = await this.client.downloadMediaMessage(M.WAMessage);
    else if (M.quoted?.message?.message?.videoMessage)
      buffer = await this.client.downloadMediaMessage(M.quoted.message);
    else if (M.WAMessage.message?.videoMessage)
      buffer = await this.client.downloadMediaMessage(M.WAMessage);
    if (!buffer) return void M.reply(`Give me an image/gif to search, Baka!`);
    const client = new SauceNao();
    const options = {
      apiKey: "76c80760cb78cf2864044ae0e9ad1f2f892cc858",
      image: buffer,
    };
    const i = await client.gimmeSauce(options);
    console.log(i);
  };
}
