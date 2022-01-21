import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
//import { getQuizById } from "anime-quiz";
import ms from "parse-ms-js";
export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "answer",
      description: `Answer the last quiz sent by the bot.`,
      aliases: ["ans"],
      category: "games",
      usage: `${client.config.prefix}answer [your_answer]`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const time = 15000;
    const cd = await (await this.client.getCd(M.sender.jid)).answer;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you use this command again in *${timeLeft.seconds} second(s)*`
      );
    }
    const w = "ongoing";
    const y = "answeredId";
    if (await !(await this.client.getGroupData(M.from)).ongoing)
      return void M.reply(
        `There aren't any quiz for you to answer. Use *${this.client.config.prefix}quiz* to start a quiz.`
      );
    if (!joined) {
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(`Please provide the option number.`);
      else return void M.reply(`Provide the option number, Baka!`);
    }
    const ans: any = joined.split("  ")[0];
    if (isNaN(ans)) return void M.reply(`The option type must be a number.`);
    if (ans > 5 || ans < 1) {
      return void M.reply(`Invalid option.`);
    }
    const id = await (await this.client.getGroupData(M.from)).quizId;
    const aid = await (await this.client.getUser(M.sender.jid)).answeredId;
    const exp = Math.floor(Math.random() * 100);
    if (id === aid) {
      return void M.reply(
        `You have recently attempted to answer this question, give it a break.`
      );
    }
    const correctAns = await (await this.client.getGroupData(M.from)).correct;
    if (ans == correctAns) {
      await this.client.DB.cd.updateOne(
        { jid: M.sender.jid },
        { $set: { answer: Date.now() } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: false } }
      );
      await this.client.setXp(M.sender.jid, exp, 40);
      return void M.reply(
        `🎉 Correct answer. You have earned *${exp} experience*.`
      );
    } else if (ans !== correctAns) {
      await this.client.DB.user.updateOne(
        { jid: M.sender.jid },
        { $set: { [y]: id } }
      );
      return void M.reply(`✖️ Wrong guess.`);
    }
  };
}
