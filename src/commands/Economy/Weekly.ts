import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import ms from "parse-ms-js";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "weekly",
      description: "A best way to earn gold. More effective than daily.",
      aliases: ["weekly"],
      category: "economy",
      usage: `${client.config.prefix}weekly`,
      baseXp: 30,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const user = M.sender.jid;
    const time = 604800000;
    const cd = await (await this.client.getCd(user)).weekly;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `You have already claimed your weekly gold. Claim again in *${timeLeft.days} day(s), ${timeLeft.hours} hour(s), ${timeLeft.minutes} minute(s), ${timeLeft.seconds} second(s)*`
      );
    }
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
      contentText: `🎉 *5000 gold* has been added to your wallet.`,
      footerText: "🌠 Shooting Star 🌠",
      buttons: buttons,
      headerType: 1,
    };
    await this.client.addGold(user, 5000);
    await this.client.DB.cd.updateOne(
      { jid: user },
      { $set: { weekly: Date.now() } }
    );
    return void M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
