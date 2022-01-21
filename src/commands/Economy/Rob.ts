import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
import { MessageType } from "@adiwajshing/baileys";
import ms from "parse-ms-js"

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "rob",
      description: "Are you a good robber?",
      aliases: ["rob"],
      category: "economy",
      usage: `${client.config.prefix}rob [tag/quote]`,
      baseXp: 30,
      gold: 0,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    if ((await this.client.getGroupData(M.from)).gamblingforlife)
      return void M.reply(
        `You can't rob someone here. Go somewhere else, Baka!`
      );
    const time = 900000;
    const cd = await (await this.client.getCd(M.sender.jid)).lastRob
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you can use this command again in *${timeLeft.seconds} second(s)*`
      );
    }
    const user = M.sender.jid;
    const target =
      M.quoted && M.mentioned.length === 0
        ? M.quoted.sender
        : M.mentioned[0] || null;
    if (!target || target === M.sender.jid) {
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(`Mention or quote the user.`);
      if (await (await this.client.getGroupData(M.from)).tsundere)
        return void M.reply(`Good luck robbing yourself.`);
    }
    const inv = await (await this.client.getUser(target!)).inventory;
    if (inv.includes("Protection Charm")) {
      await this.client.DB.cd.updateOne( { jid: user }, { $set: { lastRob: Date.now() } } )
      return void M.reply(
        `*@${
          target?.split("@")[0]
        }'s* 🎐 *Protection Charm* protected themselves from getting robbed.`,
        MessageType.text,
        undefined,
        [target!]
      );
    }
   const results = [
     "robbed",
     "caught",
     "caught",
     "caught",
     "robbed",
     "caught",
     "caught",
     "caught",
     "caught",
     "caught",
   ];
   const wallet1 = await (await this.client.getGold(user)).wallet
   const wallet2 = await (await this.client.getGold(target!)).wallet
   if (wallet1 < 250) return void M.reply(`🟥 *You need at least 250 gold in your wallet to rob someone.*`)
   if (wallet2 < 250) return void M.reply(`Please leave this poor person alone.`)
   const result = results[Math.floor(Math.random () * results.length)]
   if (result === "caught") {
     const gold = Math.floor(Math.random () * wallet1)
     await this.client.reduceGold(user, gold)
     await this.client.addGold(target!, gold)
     return void M.reply(
       `Congratulations *@${
         M.sender.jid.split("@")[0]
       }*, you got caught and paid *${gold} gold* to *@${
         target?.split("@")[0]
       }*`,
       MessageType.text,
       undefined,
       [target || "", M.sender.jid]
     );
   } else {
     const gold = Math.floor(Math.random() * wallet2)
     await this.client.addGold(user, gold)
     await this.client.reduceGold(target!, gold)
     return void M.reply(
       `*@${M.sender.jid.split("@")[0]}* robbed *@${
         target?.split("@")[0]
       }* and got away with *${gold} gold!*`,
       MessageType.text,
       undefined,
       [target || "", M.sender.jid]
     );
   }
  };
}
