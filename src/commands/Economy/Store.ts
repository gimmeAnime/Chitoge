/** @format */

import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "store",
      description: "Will show you the store.",
      aliases: ["shop"],
      category: "economy",
      usage: `${client.config.prefix}store`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    await M.reply(
      `🏬 *Shooting Star Store* 🏬\n\n*1) 🧧 Item Name: Experience Charm*\n\t💬 *Description: By having this item, you will gain 2x experience for using every command.*\n\t🔖 *Price: 25000 gold*\n\n*2) 🧧 Item Name: Protection Charm*\n\t💬 *Description: This item protects you from getting robbed.*\n\t🔖 *Price: 30000 gold*\n\nUse :buy <item_number> to buy an item. Example - :buy 2`
    );
  };
}
