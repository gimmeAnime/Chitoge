/** @format */

import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "info",
      description: "Will display the info of the bot",
      category: "general",
      usage: `${client.config.prefix}info`,
      baseXp: 0,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    /*eslint-disable @typescript-eslint/no-explicit-any*/
    const chats = await this.client.DB.group.count();
    const users = await this.client.DB.user.count();
    const pad = (s: any) => (s < 10 ? "0" : "") + s;
    const formatTime = (seconds: any) => {
      const hours = Math.floor(seconds / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const secs = Math.floor(seconds % 60);
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    };
    const uptime = () => formatTime(process.uptime());
    await M.reply(
      `*━━━❰ 🌠 Shooting Star 🌠 ❱━━━*\n\n🔮 *Groups: ${chats}*\n\n🚀 *Users: ${users}*\n\n🚦 *Uptime: ${uptime()}*`
    );
  };
}
