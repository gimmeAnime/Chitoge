import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "buy",
      description: "Buys the item from store.",
      aliases: ["purchase"],
      category: "economy",
      usage: `${client.config.prefix}buy <item_number>`,
      baseXp: 30,
      gold: 10,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    if (!joined) return void M.reply(`🟥 *Provide the item index number*.`);
    const e: any = joined.split("  ");
    if (isNaN(e[0]))
      return void M.reply(`🟥 *The item index must be a number*.`);
    if (e[0] <= 0 || e[0] >= 3)
      return void M.reply(`Invalid item index number.`);
    const inv = await (await this.client.getUser(M.sender.jid)).inventory;
    const wallet = await (await this.client.getGold(M.sender.jid)).wallet;
    if (e[0] == 1) {
      const item = "Experience Charm";
      if (inv.includes(item))
        return void M.reply(`🟥 *You can't buy this item more than 1 time.*`);
      if (wallet < 25000)
        return void M.reply(
          `🟥 *You don't have sufficient gold in your wallet to buy this item.*`
        );
      await this.client.reduceGold(M.sender.jid, 25000);
      await this.client.DB.user.updateOne(
        { jid: M.sender.jid },
        { $push: { inventory: item } }
      );
      return void M.reply(`*You bought ${item} for 25000 gold*.`);
    } else if (e[0] == 2) {
      const item = "Protection Charm";
      if (inv.includes(item))
        return void M.reply(`🟥 *You can't buy this item more than 1 time.*`);
      if (wallet < 30000)
        return void M.reply(
          `🟥 *You don't have sufficient gold in your wallet to buy this item.*`
        );
      await this.client.reduceGold(M.sender.jid, 30000);
      await this.client.DB.user.updateOne(
        { jid: M.sender.jid },
        { $push: { inventory: item } }
      );
      return void M.reply(`*You bought ${item} for 30000 gold*.`);
    }
  };
}
