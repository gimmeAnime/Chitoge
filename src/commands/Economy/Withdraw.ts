import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import ms from "parse-ms-js";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "withdraw",
      description: "Withdraw your gold from bank",
      aliases: ["withdraw"],
      category: "economy",
      usage: `${client.config.prefix}withdraw <amount>`,
      baseXp: 30,
      gold: 25,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    const time = 15000;
    const user = M.sender.jid;
    const bank = await (await this.client.getGold(user)).bank;
    const cd = await (await this.client.getCd(user)).withdraw;
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
      //if (await (await this.client.getGroupData(M.from)).normal
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(`Please specify the amount of gold to withdraw.`);
    }
    if (bank < amount)
      return void M.reply(
        `🟥 *You don't have sufficient amount of gold in your bank to make this transaction*.`
      );
    const text = `You have withdrawn *${amount} gold* from your bank.`;
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

    await this.client.withdraw(user, amount);
    await this.client.DB.cd.updateOne(
      { jid: M.sender.jid },
      { $set: { withdraw: Date.now() } }
    );
    return void M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
