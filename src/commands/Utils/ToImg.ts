import { MessageType, Mimetype } from "@adiwajshing/baileys";
import { Sticker, Categories, StickerTypes } from "wa-sticker-formatter";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import fs from "fs/promises";
import { tmpdir } from "os";
import { exec } from "child_process";
import { existsSync } from "fs";
import { promisify } from "util";
// import webp from 'node-webpmux'
export default class Command extends BaseCommand {
  exe() {
    throw new Error("Method not implemented.");
  }
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "toimg",
      aliases: ["toimage", "img", "togif"],
      description: "Converts sticker to image/gif",
      category: "utils",
      usage: `${client.config.prefix}toimg [(tag)[sticker]]`,
      baseXp: 35,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    parsedArgs: IParsedArgs
  ): Promise<void> => {
    let buffer;
    const exe = promisify(exec);

    if (M.quoted?.message?.message?.stickerMessage)
      buffer = await this.client.downloadMediaMessage(M.quoted.message);
    else if (M.quoted?.message?.message?.stickerMessage?.isAnimated)
      buffer = await this.client.downloadMediaMessage(M.WAMessage);
    if (!buffer)
      return void M.reply(`You didn't provide any sticker to convert`);
    const filename = `${tmpdir()}/${Math.random().toString(36)}`;
    try {
      await fs.writeFile(`${filename}.webp`, buffer);
      await exe(`ffmpeg -i ${filename}.webp ${filename}.png`);

      const imagebuffer = await fs.readFile(`${filename}.png`);
      console.log(filename);
      return void M.reply(imagebuffer, MessageType.image, undefined, undefined);
      /* only image works for now
		animated webp will give error 
		*/
    } catch (error) {
      const gif = await this.client.util.webpToMp4(buffer);
      return void M.reply(gif, MessageType.video, Mimetype.gif);
    }
  };
}
