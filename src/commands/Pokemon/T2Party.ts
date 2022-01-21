import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "t2party",
      description: `Transfers the pokemon in your pc to party.`,
      aliases: ["t2party"],
      category: "pokemon",
      usage: `${client.config.prefix}t2party [pc_index_number]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const data = await (await this.client.getPokemons(M.sender.jid)).pc;
    const i = await (await this.client.getPokemons(M.sender.jid)).party;
    if (!joined)
      return void M.reply(
        `Provide the index number of the pokemon in your pc that you wanna transfer to your party.`
      );
    const buttons = [
      {
        buttonId: "pc",
        buttonText: { displayText: `${this.client.config.prefix}pc` },
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
      contentText: `You might want to check your pc.`,
      footerText: "🌠 Shooting Star 🌠",
      buttons: buttons,
      headerType: 1,
    };
    const r: any = joined.split(" ")[0];
    if (isNaN(r)) return void M.reply(`It must be a number.`);
    if (r > data.length)
      return void M.reply(buttonMessage, MessageType.buttonsMessage);
    if (i.length >= 6)
      return void M.reply(`You can't have more than 6 pokemons at your party.`);
    const Name = data[r - 1].name;
    const Id = data[r - 1].id;
    const Level = data[r - 1].level;
    const Image = data[r - 1].image;
    await this.client.DB.pokemons.updateOne(
      { jid: M.sender.jid },
      { $pull: { pc: { id: Id, level: Level, name: Name, image: Image } } }
    );
    await this.client.DB.pokemons.updateOne(
      { jid: M.sender.jid },
      { $push: { party: { id: Id, level: Level, name: Name, image: Image } } }
    );
    await M.reply(
      `*${this.client.util.capitalize(
        Name
      )}* has been transferred to your party.`
    );
  };
}
