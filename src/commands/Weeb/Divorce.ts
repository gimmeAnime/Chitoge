/** @format */

import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import ms from "parse-ms-js";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "divorce",
      description: `Divorce your current haigusha.`,
      aliases: ["divorce"],
      category: "weeb",
      usage: `${client.config.prefix}divorce`,
      baseXp: 10,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const user = M.sender.jid;
    const time = 60000;
    const cd = await (await this.client.getCd(user)).divorce;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you can use this command again in *${timeLeft.seconds} second(s)*`
      );
    }
    const l = await (await this.client.getHaigusha(M.sender.jid)).haigusha;
    if (await !(await this.client.getHaigusha(M.sender.jid)).married)
      return void M.reply(`You aren't married to anyone.`);
    const j = "married";
    const buttons = [
      {
        buttonId: "haigusha",
        buttonText: { displayText: `${this.client.config.prefix}haigusha` },
        type: 1,
      },
    ];
    const text = `💔 You divorced *${l}*.`;
    await this.client.DB.haigusha.updateOne(
      { jid: M.sender.jid },
      { $set: { [j]: false } }
    );
    await this.client.DB.cd.updateOne(
      { jid: M.sender.jid },
      { $set: { divorce: Date.now() } }
    );
    const buttonMessage: any = {
      contentText: `${text}`,
      footerText: "🌠 Shooting Star 🌠",
      buttons: buttons,
      headerType: 1,
    };
    await M.reply(buttonMessage, MessageType.buttonsMessage);
  };
}
