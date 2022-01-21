/** @format */

import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient, { toggleableGroupActions } from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      adminOnly: true,
      command: "act",
      aliases: ["become"],
      description: "How should I act?",
      category: "moderation",
      usage: `${client.config.prefix}act [tsundere | normal]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const type = joined.trim().toLowerCase() as toggleableGroupActions;
    const actions = ["tsundere", "normal"];
    let i;
    if (type === "tsundere") {
      i = "normal";
    } else {
      i = "tsundere";
    }
    const buttons = [
      {
        buttonId: "act tsundere",
        buttonText: { displayText: `${this.client.config.prefix}act tsundere` },
        type: 1,
      },
      {
        buttonId: "act normal",
        buttonText: { displayText: `${this.client.config.prefix}act normal` },
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
      contentText: `I don't know how to act like that. I can be *Tsundere* or *Normal*.`,
      footerText: "🌠 Shooting Star 🌠",
      buttons: buttons,
      headerType: 1,
    };
    if (!actions.includes(type))
      return void (await M.reply(buttonMessage, MessageType.buttonsMessage));
    const data = await this.client.getGroupData(M.from);
    if (data[type])
      return void (await M.reply(
        `I'm already *${this.client.util.capitalize(type)}*.`
      ));
    await this.client.DB.group.updateOne(
      { jid: M.from },
      { $set: { [type]: true } }
    );
    await this.client.DB.group.updateOne(
      { jid: M.from },
      { $set: { [i]: false } }
    );
    return void M.reply(
      `I'll be *${this.client.util.capitalize(type)}* from now on.`
    );
  };
}
