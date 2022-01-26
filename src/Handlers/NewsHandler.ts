import { MessageType } from "@adiwajshing/baileys";
import { getNewsNoDetails } from "mal-scraper";
import WAClient from "../lib/WAClient";
import cron from "node-cron";

export default class NewsHandler {
  constructor(public client: WAClient) {}

  broadcastNews = async (): Promise<void> => {
    cron.schedule("*/1 * * * *", async () => {
      const groups: any = this.client.chats
        .all()
        .filter((v) => !v.read_only && !v.archive)
        .map((v) => v.jid)
        .map((jids) => (jids.includes("g.us") ? jids : null))
        .filter((v) => v);
      const news: any = await getNewsNoDetails(20);
      const data = await (await this.client.getFeatures("news")).newsId;
      if (data === news[0].newsNumber) return void null;
      for (let i = 0; i < groups.length; i++) {
        const check = await (await this.client.getGroupData(groups[i])).news;
        if (!check) continue;
        const text = `*━━━❰ JUST IN ❱━━━*\n\n🎀 *Title: ${news[0].title}*\n\n❄ *Short Details*: ${news[0].text}\n\n🌐 *URL: ${news[0].link}*`;
        const image = await this.client.getBuffer(news[0].image);
        await this.client.DB.feature.updateOne(
          { feature: "news" },
          { $set: { newsId: news[0].newsNumber } }
        );
        return void (await this.client.sendMessage(
          groups[i],
          image,
          MessageType.image,
          {
            caption: text,
            contextInfo: {
              externalAdReply: {
                title: news[0].title,
                body: news[0].text,
                thumbnail: image,
                sourceUrl: news[0].link,
              },
            },
          }
        ));
      }
    });
  };
}
