import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import ms from "parse-ms-js";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "give",
      description: "Give gold to someone.",
      aliases: ["give"],
      category: "economy",
      usage: `${client.config.prefix}give <amount> [tag/quote]`,
      baseXp: 30,
      gold: 30,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    const time = 30000;
    const cd = await (await this.client.getCd(M.sender.jid)).give;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you can use this command again in *${timeLeft.seconds} second(s)*`
      );
    }
    if (!joined)
      return void M.reply(`Specify the amount of gold to give, Baka!`);
    const bruhh: any = joined.trim().split(" ");
    const amount: number = bruhh[0] || bruhh[1];
    if (isNaN(amount))
      return void M.reply(
        `*https://en.wikipedia.org/wiki/Number*\n\nI think this might help you.`
      );
    const user = M.sender.jid;
    const target =
      M.quoted && M.mentioned.length === 0
        ? M.quoted.sender
        : M.mentioned[0] || null;
    if (!target || target === M.sender.jid) {
      if (await (await this.client.getGroupData(M.from)).tsundere)
        return void M.reply(`Good luck giving the gold of yours to yourself.`);
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(
          `Please mention or tag the user that you want to give.`
        );
    }

    const wallet = await (await this.client.getGold(user)).wallet;
    if (amount > wallet)
      return void M.reply(
        `🟥 *You need ${amount - wallet} gold more to make this transaction*.`
      );
    await this.client.DB.cd.updateOne(
      { jid: user },
      { $set: { give: Date.now() } }
    );
    await this.client.reduceGold(user, amount);
    await this.client.addGold(target!, amount);
    await M.reply(
      `*@${user.split("@")[0]}* gave *${amount} gold* to *@${
        target?.split("@")[0]
      }*`,
      MessageType.text,
      undefined,
      [user || "", target!]
    );
  };
}
