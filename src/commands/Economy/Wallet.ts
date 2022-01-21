import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import generate from "generate-unique-id";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "wallet",
      description: "Will display user's wallet.",
      aliases: ["purse"],
      category: "economy",
      usage: `${client.config.prefix}wallet`,
      baseXp: 30,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const user = M.sender.jid;
    const w = "tag";
    let id;
    if ((await (await this.client.getUser(user)).tag) === undefined) {
      id = await generate({
        length: 4,
        useLetters: false,
      });
      await this.client.DB.user.updateOne({ jid: user }, { $set: { [w]: id } });
    } else if ((await (await this.client.getUser(user)).tag) !== undefined) {
      id = await (await this.client.getUser(user)).tag;
    }
    const wallet = await (await this.client.getGold(user)).wallet;
    const buttons = [
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
      contentText: `👛 *Wallet*\n\n🎴 *ID:*\n\t🏮 *Username: ${M.sender.username}*\n\t🧧 *Tag: #${id}*\n\n🪙 *Gold: ${wallet}*`,
      footerText: "🌠 Shooting Star 🌠",
      buttons: buttons,
      headerType: 1,
    };
    await M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
