import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import ms from "parse-ms-js";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "deposit",
      description: "Deposit your gold to bank",
      aliases: ["deposit"],
      category: "economy",
      usage: `${client.config.prefix}deposit <amount>`,
      baseXp: 30,
      gold: 50,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    const time = 15000;
    const user = M.sender.jid;
    const cd = await (await this.client.getCd(user)).deposit;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you can use this command again in *${timeLeft.seconds} second(s)*`
      );
    }
    if (!joined) {
      if (await (await this.client.getGroupData(M.from)).tsundere)
        return void M.reply(`Specify the amount of gold to deposit, Baka!`);
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(`Please specify the amount of gold to deposit.`);
    }

    const amount: any = joined.trim();
    if (isNaN(amount)) {
      if (await (await this.client.getGroupData(M.from)).tsundere)
        return void M.reply(
          `*https://en.wikipedia.org/wiki/Number*\n\nI think this might help you.`
        );
      //if (await (await this.client.getGroupData(M.from)).normal) return void M.reply(`The amount of gold should be a number.`)
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(`Please specify the amount of gold to deposit.`);
    }
    const text = `You have transferred *${amount} gold* to your bank.`;
    const buttons = [
      {
        buttonId: "wallet",
        buttonText: { displayText: `${this.client.config.prefix}wallet` },
        type: 1,
      },
      {
        buttonId: "bank",
        buttonText: { displayText: `${this.client.config.prefix}bank` },
        type: 1,
      },
    ];
    interface buttonMessage {
      contentText: string;
      footerText: string;
      buttons: string[];
      headerType: number;
    }
    const buttonMessage: any = {
      contentText: `${text}`,
      footerText: "🌠 Shooting Star 🌠",
      buttons: buttons,
      headerType: 1,
    };
    const wallet = await (await this.client.getGold(user)).wallet;
    const bank = await (await this.client.getGold(user)).bank;
    if (bank >= 1000000)
      return void M.reply(
        `🟥 *You can't have more than 1000000 gold in your bank*.`
      );
    if (wallet < amount)
      return void M.reply(
        `🟥 *You don't have sufficient amount of gold in your wallet to make this transaction*.`
      );
    await this.client.deposit(user, amount);
    await this.client.DB.cd.updateOne(
      { jid: user },
      { $set: { deposit: Date.now() } }
    );
    return void M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
