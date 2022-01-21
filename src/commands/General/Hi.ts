/** @format */

import { MessageType, Mimetype } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "hi",
      description: "Generally used to check if bot is Up",
      category: "general",
      usage: `${client.config.prefix}hi`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const buttons = [
      {
        buttonId: "help",
        buttonText: { displayText: `${this.client.config.prefix}help` },
        type: 1,
      },
    ];
    if (await (await this.client.getGroupData(M.from)).normal) {
      const buttonMessage: any = {
        contentText: `Hi *${M.sender.username}*! How can I *:help* you?`,
        footerText: "🌠 Shooting Star 🌠",
        buttons: buttons,
        headerType: 1,
      };
      return void M.reply(buttonMessage, MessageType.buttonsMessage);
    } else {
      const buttonMessage: any = {
        contentText: `I don't have time to have a conversation with someone like you. Use something from the *${this.client.config.prefix}help* list if you want something.`,
        footerText: "🌠 Shooting Star 🌠",
        buttons: buttons,
        headerType: 1,
      };
      return void M.reply(buttonMessage, MessageType.buttonsMessage);
    }
  };
}
