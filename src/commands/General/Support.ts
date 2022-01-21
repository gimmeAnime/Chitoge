/** @format */

import { MessageType } from "@adiwajshing/baileys";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "support",
      aliases: ["support"],
      description: "Will give you the official group link.",
      category: "general",
      usage: `${client.config.prefix}support`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    await this.client.sendMessage(
      M.sender.jid,
      `*1) Main Support group: https://chat.whatsapp.com/LwUhLD1f1T6KurZR3WFwtf*\n\n*2) Casino group: https://chat.whatsapp.com/Kpd4LFdWAM5Ad9ERJ8zG8T*`,
      MessageType.text
    );
    return void M.reply("Sent you the Support Group Link in personal message.");
  };
}
