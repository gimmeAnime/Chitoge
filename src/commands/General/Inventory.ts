import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import generate from "generate-unique-id";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "inventory",
      description: "Displays user inventory",
      category: "general",
      usage: `${client.config.prefix}inventory`,
      aliases: ["inv"],
      baseXp: 10,
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
    const data = await (await this.client.getPokemons(user)).pokemons;
    const wallet = await (await this.client.getGold(user)).wallet;
    const bank = await (await this.client.getGold(user)).bank;
    const inv = await (await this.client.getUser(user)).inventory;
    let text = `🎒 *Inventory*\n\n🎴 *ID:*\n\t🏮 *Username: ${
      M.sender.username
    }*\n\t🧧 *Tag: #${id}*\n\n*>>* 💰 *Gold: ${
      wallet + bank
    }*\n*>>* 🍀 *Total Pokemons: ${data.length}*\n*>>* 🔗 *Total Items: ${
      inv.length
    }*\n\n*📜 Items:*`;
    for (let i = 0; i < inv.length; i++) {
      text += `\n\t\t\t\t\t\t\t*#${i + 1} - ${inv[i]}*\n`;
    }
    await M.reply(text);
  };
}
