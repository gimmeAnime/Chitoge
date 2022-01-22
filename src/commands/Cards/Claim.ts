import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";

export default class Command extends BaseCommand {
  constructor(client: WAClient, handler: MessageHandler) {
    super(client, handler, {
      command: "claim",
      description: "Claims the newest spawned card.",
      category: "cards",
      usage: `${client.config.prefix}claim`,
      baseXp: 30,
      gold: 0,
    });
  }

  run = async (M: ISimplifiedMessage): Promise<void> => {
    const user = M.sender.jid;
    const wallet = await (await this.client.getGold(user)).wallet;
    const data = await this.client.getGroupData(M.from);
    if (!data.cClaimable)
      return void M.reply(`🟥 There aren't any available cards to claim.`);
    if (wallet < data.cPrice)
      return void M.reply(
        `🟥 *You don't have sufficient amount of gold in your wallet to claim this card.*`
      );
    await this.client.reduceGold(user, data.cPrice);
    await this.client.DB.card.updateOne(
      { jid: user },
      {
        $push: {
          cards: {
            id: data.cId,
            name: data.cName,
            tier: data.cTier,
            image: data.cImage,
          },
        },
      }
    );
    if (data.cTier === "1") {
      await this.client.DB.card.updateOne(
        { jid: user },
        {
          $push: {
            "tiers.one": {
              id: data.cId,
              name: data.cName,
              tier: data.cTier,
              source: data.cSource,
              image: data.cImage,
            },
          },
        }
      );
    } else if (data.cTier === "2") {
      await this.client.DB.card.updateOne(
        { jid: user },
        {
          $push: {
            "tiers.two": {
              id: data.cId,
              name: data.cName,
              tier: data.cTier,
              source: data.cSource,
              image: data.cImage,
            },
          },
        }
      );
    } else if (data.cTier === "3") {
      await this.client.DB.card.updateOne(
        { jid: user },
        {
          $push: {
            "tiers.three": {
              id: data.cId,
              name: data.cName,
              tier: data.cTier,
              source: data.cSource,
              image: data.cImage,
            },
          },
        }
      );
    } else if (data.cTier === "4") {
      await this.client.DB.card.updateOne(
        { jid: user },
        {
          $push: {
            "tiers.four": {
              id: data.cId,
              name: data.cName,
              tier: data.cTier,
              source: data.cSource,
              image: data.cImage,
            },
          },
        }
      );
    } else if (data.cTier === "5") {
      await this.client.DB.card.updateOne(
        { jid: user },
        {
          $push: {
            "tiers.five": {
              id: data.cId,
              name: data.cName,
              tier: data.cTier,
              source: data.cSource,
              image: data.cImage,
            },
          },
        }
      );
    } else if (data.cTier === "6") {
      await this.client.DB.card.updateOne(
        { jid: user },
        {
          $push: {
            "tiers.six": {
              id: data.cId,
              name: data.cName,
              tier: data.cTier,
              source: data.cSource,
              image: data.cImage,
            },
          },
        }
      );
    } else {
      await this.client.DB.card.updateOne(
        { jid: user },
        {
          $push: {
            "tiers.s": {
              id: data.cId,
              name: data.cName,
              tier: data.cTier,
              source: data.cSource,
              image: data.cImage,
            },
          },
        }
      );
    }
    return void M.reply(`You claimed it`);
  };
}
