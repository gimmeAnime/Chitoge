import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
//import { getQuizById } from "anime-quiz";
import ms from "parse-ms-js";
import { MessageType } from "@adiwajshing/baileys";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "catch",
      description: `Catches the last pokemon.`,
      aliases: ["c"],
      category: "pokemon",
      usage: `${client.config.prefix}catch [pokemon_name]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const time = 15000;
    const cd = await (await this.client.getCd(M.sender.jid)).catch;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you use this command again in *${timeLeft.seconds} second(s)*`
      );
    }
    const o = "catchable";
    if (!(await (await this.client.getGroupData(M.from)).catchable))
      return void M.reply(`There aren't any available pokemon to catch.`);
    const data = await this.client.getPokemons(M.sender.jid);
    if (!joined) {
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(
          `Please provide the name of the pokemon. Example - *:catch pikachu*.`
        );
      else
        return void M.reply(
          `Provide the name of the pokemon, Baka! Example - *:catch pikachu*.`
        );
    }
    const p: string = joined.split("  ")[0].toLowerCase();
    const n = await this.client.getGroupData(M.from);
    const Name = n.lastPokemon;
    const Id = n.pId;
    const Level = n.pLevel;
    const Image = n.pImage;
    const exp = Math.floor(Math.random() * (200 - 100) + 100);
    const gold = Math.floor(Math.random() * (250 - 100) + 100);
    const buttons = [
      {
        buttonId: "party",
        buttonText: { displayText: `${this.client.config.prefix}party` },
        type: 1,
      },
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

    if (p !== Name) {
      return void M.reply(`Wrong Pokemon.`);
    } else if (p === Name) {
      await this.client.DB.pokemons.updateOne(
        { jid: M.sender.jid },
        { $push: { pokemons: Name } }
      );
      
      await this.client.setXp(M.sender.jid, exp, 50);
      await this.client.addGold(M.sender.jid, gold);
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [o]: false } }
      );
      await this.client.DB.cd.updateOne(
        { jid: M.sender.jid },
        { $set: { catch: Date.now() } }
      );
      if (data.party.length < 6) {
        const buttonMessage: any = {
          contentText: `Well done. You caught a level ${Level} ${this.client.util.capitalize(
            Name
          )}.`,
          footerText: "🌠 Shooting Star 🌠",
          buttons: buttons,
          headerType: 1,
        };
        await this.client.DB.pokemons.updateOne(
          { jid: M.sender.jid },
          {
            $push: {
              party: { id: Id, level: Level, name: Name, image: Image },
            },
          }
        );
        return void M.reply(buttonMessage, MessageType.buttonsMessage);
      } else if (data.party.length >= 6) {
        const buttonMessage: any = {
          contentText: `Well done. You caught a level ${Level} ${this.client.util.capitalize(
            Name
          )}. It has been transferred to your pc.`,
          footerText: "🌠 Shooting Star 🌠",
          buttons: buttons,
          headerType: 1,
        };
        await this.client.DB.pokemons.updateOne(
          { jid: M.sender.jid },
          { $push: { pc: { id: Id, level: Level, name: Name, image: Image } } }
        );
        return void M.reply(buttonMessage, MessageType.buttonsMessage);
      }
    }
  };
}
