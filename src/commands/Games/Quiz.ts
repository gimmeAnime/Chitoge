import { getRandomQuiz, getQuizById } from "anime-quiz";
import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { IParsedArgs, ISimplifiedMessage } from "../../typings";
import { MessageType, Mimetype } from "@adiwajshing/baileys";
import request from "../../lib/request";
import ms from "parse-ms-js";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "quiz",
      description: `Will give you a random anime quiz to answer.`,
      aliases: ["start-quiz"],
      category: "games",
      usage: `${client.config.prefix}quiz`,
      baseXp: 0,
    });
  }

  run = async (
    M: ISimplifiedMessage,
    { joined }: IParsedArgs
  ): Promise<void> => {
    const time = 75000;
    const cd = await (await this.client.getCd(M.from)).quiz;
    if (time - (Date.now() - cd) > 0) {
      const timeLeft = ms(time - (Date.now() - cd));
      return void M.reply(
        `Woahh! Slow down, you use this command again in *${timeLeft.seconds} second(s)* for this group.`
      );
    }
    const w = "ongoing";
    const term = joined.trim().split(" ");
    if (term[0] === "--ff" || term[0] === "--forfeit") {
      if (await (await this.client.getGroupData(M.from)).ongoing) {
        await this.client.DB.group.updateOne(
          { jid: M.from },
          { $set: { [w]: false } }
        );
        return void M.reply(`You forfeited the quiz.`);
      } else {
        return void M.reply(`There are no quiz ongoing.`);
      }
    }
    if (await (await this.client.getGroupData(M.from)).ongoing)
      return void M.reply(
        `A quiz is already going on. Use *${this.client.config.prefix}quiz --ff* to forfeit this quiz.`
      );
    const quiz = await getRandomQuiz();
    const v = "correct";
    const k = "quizId";
    if (quiz.image === null && quiz.gif === null) {
      await this.client.DB.cd.updateOne(
        { jid: M.from },
        { $set: { quiz: Date.now() } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: true } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [k]: quiz.id } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [v]: quiz.answer[1] } }
      );
      let text = "";
      text += `🎀 *Question: ${quiz.question}*\n\n`;
      for (let i = 0; i < quiz.options.length; i++) {
        text += `*${i + 1}) ${quiz.options[i]}*\n`;
      }
      text += `\n🧧 *Use ${this.client.config.prefix}answer <option_number> to answer this question.*`;
      text += `\n\n📒 *Note: You only have 60 seconds to answer.*`;
      await M.reply(text);
    } else if (quiz.gif === null) {
      await this.client.DB.cd.updateOne(
        { jid: M.from },
        { $set: { quiz: Date.now() } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: true } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [k]: quiz.id } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [v]: quiz.answer[1] } }
      );
      let text = "";
      text += `🎀 *Question: ${quiz.question}*\n\n`;
      for (let i = 0; i < quiz.options.length; i++) {
        text += `*${i + 1}) ${quiz.options[i]}*\n`;
      }
      text += `\n🧧 *Use ${this.client.config.prefix}answer <option_number> to answer this question.*\n\n`;
      text += `📒 *Note: You only have 60 seconds to answer.*`;
      await M.reply(
        await request.buffer(quiz.image),
        MessageType.image,
        undefined,
        undefined,
        text,
        undefined
      );
    } else if (quiz.image === null) {
      await this.client.DB.cd.updateOne(
        { jid: M.from },
        { $set: { quiz: Date.now() } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: true } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [k]: quiz.id } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [v]: quiz.answer[1] } }
      );
      let text = "";
      text += `🎀 *Question: ${quiz.question}*\n\n`;
      for (let i = 0; i < quiz.options.length; i++) {
        text += `*${i + 1}) ${quiz.options[i]}*\n`;
      }
      text += `\n🧧 *Use ${this.client.config.prefix}answer <option_number> to answer this question.*\n\n`;
      text += `📒 *Note: You only have 60 seconds to answer.*`;
      await M.reply(
        await this.client.util.GIFBufferToVideoBuffer(
          await this.client.getBuffer(quiz.gif)
        ),
        MessageType.video,
        Mimetype.gif,
        undefined,
        text
      );
    }
    setTimeout(async () => {
      if (await !(await this.client.getGroupData(M.from)).ongoing)
        return void null;
      const id = await (await this.client.getGroupData(M.from)).quizId;
      const g = await getQuizById(id);
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: false } }
      );
      return void M.reply(
        `🕕 Timed out! The correct answer was *${g.answer[1]}) ${g.answer[0]}.*`
      );
    }, 60000);
  };
}
