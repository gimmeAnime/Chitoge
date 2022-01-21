/** @format */

import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient, { toggleableGroupActions } from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      adminOnly: true,
      command: "disable",
      aliases: ["deactivate"],
      description: "Disables certain features on group-chats",
      category: "moderation",
      usage: `${client.config.prefix}disable [feature]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const Data = await this.client.getFeatures("wild");
    const type = joined.trim().toLowerCase() as toggleableGroupActions;
    if (type === "tsundere" || type === "normal")
      return void M.reply(`🟥 Invalid Option: *${type}*`);
    if (!Object.values(toggleableGroupActions).includes(type))
      return void M.reply(`🟥 Invalid Option: *${type}*`);
    const data = await this.client.getGroupData(M.from);
    if (!data[type])
      return void M.reply(
        `🟨 *${this.client.util.capitalize(type)}* is already *disabled*, Baka!`
      );
    await this.client.DB.group.updateOne(
      { jid: M.from },
      { $set: { [type]: false } }
    );
    return void M.reply(
      `🟩 *${this.client.util.capitalize(type)}* is now disabled`
    );
  };
}
