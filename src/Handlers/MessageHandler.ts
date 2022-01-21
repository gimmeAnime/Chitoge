/** @format */

import axios from "axios";
import chalk from "chalk";
import { join } from "path";
import BaseCommand from "../lib/BaseCommand";
import WAClient from "../lib/WAClient";
import { ICommand, IParsedArgs, ISimplifiedMessage } from "../typings";
import { MessageType } from "@adiwajshing/baileys";
import { setTimeout } from "timers";
//import { setIntervalAsync } from "set-interval-async/legacy";
export default class MessageHandler {
  commands = new Map<string, ICommand>();
  aliases = new Map<string, ICommand>();
  constructor(public client: WAClient) {}

  handleMessage = async (M: ISimplifiedMessage): Promise<void> => {
    if (M.WAMessage?.message?.listResponseMessage) {
      const key: any = M.WAMessage?.message?.listResponseMessage.title;
      const comm = this.commands.get(key) || this.aliases.get(key);
      console.log(comm?.config);
      const state = await this.client.DB.disabledcommands.findOne({
        command: comm?.config.command,
      });
      if (
        comm?.config?.command === undefined ||
        (await this.client.getGroupData(M.from)).bot !== this.client.user.name
      )
        return void null;
      M.reply(
        `🚀 *Command:* ${this.client.util.capitalize(
          comm?.config?.command
        )}\n📈 *Status:* ${state ? "Disabled" : "Available"}
            \n⛩ *Category:* ${this.client.util.capitalize(
              comm?.config?.category || ""
            )}${
          comm?.config.aliases && comm?.config.command !== "react"
            ? `\n♦️ *Aliases:* ${comm?.config.aliases
                .map(this.client.util.capitalize)
                .join(", ")}`
            : ""
        }\n🎐 *Group Only:* ${this.client.util.capitalize(
          JSON.stringify(!comm?.config.dm ?? true)
        )}\n💎 *Usage:* ${comm?.config?.usage || ""}\n\n📒 *Description:* ${
          comm?.config?.description || ""
        }`
      );
    }
    if (M.WAMessage?.message?.buttonsResponseMessage) {
      const res: any =
        M.WAMessage?.message?.buttonsResponseMessage.selectedButtonId;
      const command = this.commands.get(res);
      console.log("response", res);
      // console.log(command?.commands.run);
      const { args, groupMetadata, sender } = M;
      if (
        (await this.client.getGroupData(M.from)).bot !== this.client.user.name
      )
        return void null;
      // const args:any = ''
      command?.run(M, this.parseArgs(args));
      // console.log(M.WAMessage.message)
    }
    if (
      !(M.chat === "dm") &&
      M.WAMessage.key.fromMe &&
      M.WAMessage.status.toString() === "2"
    ) {
      /*
            BUG : It receives message 2 times and processes it twice.
            https://github.com/adiwajshing/Baileys/blob/8ce486d/WAMessage/WAMessage.d.ts#L18529
            https://adiwajshing.github.io/Baileys/enums/proto.webmessageinfo.webmessageinfostatus.html#server_ack
            */
      M.sender.jid = this.client.user.jid;
      M.sender.username =
        this.client.user.name ||
        this.client.user.vname ||
        this.client.user.short ||
        "Chitoge";
    } else if (M.WAMessage.key.fromMe) return void null;

    if (M.from.includes("status")) return void null;
    const { args, groupMetadata, sender } = M;
    if (M.chat === "dm" && this.client.isFeature("chatbot")) {
      if (this.client.config.chatBotUrl) {
        const myUrl = new URL(this.client.config.chatBotUrl);
        const params = myUrl.searchParams;
        await axios
          .get(
            `${encodeURI(
              `http://api.brainshop.ai/get?bid=${params.get(
                "bid"
              )}&key=${params.get("key")}&uid=${M.sender.jid}&msg=${M.args}`
            )}`
          )
          .then((res) => {
            if (res.status !== 200)
              return void M.reply(`🔍 Error: ${res.status}`);
            return void M.reply(res.data.cnt);
          })
          .catch(() => {
            M.reply(`Well...`);
          });
      }
    }
    if (!M.groupMetadata && !(M.chat === "dm")) return void null;

    if (
      (await this.client.getGroupData(M.from)).mod &&
      M.groupMetadata?.admins?.includes(this.client.user.jid)
    )
      this.moderate(M);
    if (!args[0] || !args[0].startsWith(this.client.config.prefix))
      return void this.client.log(
        `${chalk.blueBright("MSG")} from ${chalk.green(
          sender.username
        )} in ${chalk.cyanBright(groupMetadata?.subject || "")}`
      );

    //cron.schedule("0 */5 * * * *", async () => {
    /*if (
        !(await this.client.getGroupData(M.from)).wild ||
        this.client.user.name !==
          (await (
            await this.client.getGroupData(M.from)
          ).bot)
      )
        return void null;
      const i = Math.floor(Math.random() * 898);
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${i}`
      );
      const buffer = await this.client.getBuffer(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
      );
      const o = "catchable";
      const w = "lastPokemon";
      const v = "pId";
      const l = "pLevel";
      const r = "pImage";
      const y = Math.floor(Math.random() * 100);
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [o]: true } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: data.name } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [v]: data.id } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [l]: y } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        {
          $set: {
            [r]: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
          },
        }
      );
      await this.client.sendMessage(M.from, buffer, MessageType.image, {
        caption: `A wild Pokemon appeared. Use ${this.client.config.prefix}catch <pokemon_name> to catch it.`,
      });
    });*/
    const h = [3600000, 1500000, 300000, 1020000, 1440000, 2220000, 4680000];
    const z = h[Math.floor(Math.random() * h.length)];
    setTimeout(async () => {
      if (
        !(await this.client.getGroupData(M.from)).wild ||
        this.client.user.name !==
          (await (
            await this.client.getGroupData(M.from)
          ).bot)
      )
        return void null;
      const i = Math.floor(Math.random() * 898);
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${i}`
      );
      const buffer = await this.client.getBuffer(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
      );
      const o = "catchable";
      const w = "lastPokemon";
      const v = "pId";
      const l = "pLevel";
      const r = "pImage";
      const y = Math.floor(Math.random() * 100);
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [o]: true } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: data.name } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [v]: data.id } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [l]: y } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        {
          $set: {
            [r]: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
          },
        }
      );
      await this.client.sendMessage(M.from, buffer, MessageType.image, {
        caption: `A wild Pokemon appeared. Use ${this.client.config.prefix}catch <pokemon_name> to catch it.`,
      });
    }, z);
    /*setIntervalAsync(async () => {
      if (!(await this.client.getGroupData(M.from)).wild) return void null;
      const i = Math.floor(Math.random() * 898);
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${i}`
      );
      const buffer = await this.client.getBuffer(
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
      );
      const o = "catchable";
      const w = "lastPokemon";
      const v = "pId";
      const l = "pLevel";
      const r = "pImage";
      const y = Math.floor(Math.random() * 100);
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [o]: true } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [w]: data.name } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [v]: data.id } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        { $set: { [l]: y } }
      );
      await this.client.DB.group.updateOne(
        { jid: M.from },
        {
          $set: {
            [r]: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
          },
        }
      );
      await this.client.sendMessage(M.from, buffer, MessageType.image, {
        caption: `A wild Pokemon appeared. Use ${this.client.config.prefix}catch <pokemon_name> to catch it.`,
      });
    }, 300000);*/

    const cmd = args[0].slice(this.client.config.prefix.length).toLowerCase();
    let text;
    if (await (await this.client.getGroupData(M.from)).tsundere) {
      text = `No such command, Baka! Have you never seen someone use the command *${this.client.config.prefix}help*.`;
    } else {
      text = `Invalid command. Try using one from the *${this.client.config.prefix}help* list.`;
    }
    const buttons = [
      {
        buttonId: "help",
        buttonText: { displayText: `${this.client.config.prefix}help` },
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
      contentText: `${text}`,
      footerText: "🌠 Shooting Star 🌠",
      buttons: buttons,
      headerType: 1,
    };
    const i = Math.floor(Math.random() * 50);
    
    const bot = await (await this.client.getGroupData(M.from)).bot;
    const allowedCommands = ["enable", "disable", "switch"];
    if (!(await this.client.getGroupData(M.from)).cmd)
      return void this.client.log(
        `${chalk.green("CMD")} ${chalk.yellow(
          `${args[0]}[${args.length - 1}]`
        )} from ${chalk.green(sender.username)} in ${chalk.cyanBright(
          groupMetadata?.subject || "DM"
        )}`
      );
    const command = this.commands.get(cmd) || this.aliases.get(cmd);
    this.client.log(
      `${chalk.green("CMD")} ${chalk.yellow(
        `${args[0]}[${args.length - 1}]`
      )} from ${chalk.green(sender.username)} in ${chalk.cyanBright(
        groupMetadata?.subject || "DM"
      )}`
    );
    if (bot !== this.client.user.name && cmd !== "switch") return void null;
    if (!command)
      return void M.reply(buttonMessage, MessageType.buttonsMessage);
    const user = await this.client.getUser(M.sender.jid);
    if (user.ban) return void M.reply("You're Banned from using commands.");

    const state = await this.client.DB.disabledcommands.findOne({
      command: command?.config?.command,
    });
    if (state)
      return void M.reply(
        `✖ This command is disabled${
          state.reason ? ` for ${state.reason}` : ""
        }`
      );
    if (!command?.config?.dm && M.chat === "dm") {
      if (await (await this.client.getGroupData(M.from)).tsundere)
        return void M.reply(`This command is only meant for groups, Baka!`);
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply("This command can only be used in groups");
    }

    if (
      command?.config?.modsOnly &&
      !this.client.config.mods?.includes(M.sender.jid)
    ) {
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(`Only MODS are allowed to use this command.`);
      if (await (await this.client.getGroupData(M.from)).tsundere)
        return void M.reply(`This command is only meant for the MODS, Baka!`);
    }
    if (command?.config?.adminOnly && !M.sender.isAdmin) {
      if (await (await this.client.getGroupData(M.from)).tsundere)
        return void M.reply(
          `This command is only meant for the group admins, Baka!`
        );
      if (await (await this.client.getGroupData(M.from)).normal)
        return void M.reply(
          `This command can only be used by the group admins.`
        );
    }

    try {
      if (
        (await (await this.client.getUser(M.sender.jid)).username) !==
        M.sender.username
      )
        await this.client.DB.user.updateOne(
          { jid: M.sender.jid },
          { $set: { username: M.sender.username } }
        );
      await command?.run(M, this.parseArgs(args));
      if (command?.config.baseXp) {
        await this.client.setXp(M.sender.jid, command?.config.baseXp || 10, 50);
        await this.client.addGold(M.sender.jid, i);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return void this.client.log(err.message, true);
    }
    /*try {
			await command?.run(M, this.parseArgs(args));
			
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			return void this.client.log(err.message, true);
		}*/
  };

  moderate = async (M: ISimplifiedMessage): Promise<void> => {
    if (M.sender.isAdmin) return void null;
    if (M.urls.length) {
      const groupinvites = M.urls.filter((url) =>
        url.includes("chat.whatsapp.com")
      );
      if (groupinvites.length) {
        groupinvites.forEach(async (invite) => {
          const splitInvite = invite.split("/");
          const z = await this.client.groupInviteCode(M.from);
          if (z !== splitInvite[splitInvite.length - 1]) {
            this.client.log(
              `${chalk.blueBright("MOD")} ${chalk.green(
                "Group Invite"
              )} by ${chalk.yellow(M.sender.username)} in ${
                M.groupMetadata?.subject || ""
              }`
            );
            return void (await this.client.groupRemove(M.from, [M.sender.jid]));
          }
        });
      }
    }
  };

  loadCommands = (): void => {
    this.client.log(chalk.green("Loading Commands..."));
    const path = join(__dirname, "..", "commands");
    const files = this.client.util.readdirRecursive(path);
    files.map((file) => {
      const filename = file.split("/");
      if (!filename[filename.length - 1].startsWith("_")) {
        //eslint-disable-next-line @typescript-eslint/no-var-requires
        const command: BaseCommand = new (require(file).default)(
          this.client,
          this
        );
        this.commands.set(command.config.command, command);
        if (command.config.aliases)
          command.config.aliases.forEach((alias) =>
            this.aliases.set(alias, command)
          );
        this.client.log(
          `Loaded: ${chalk.green(command.config.command)} from ${chalk.green(
            file
          )}`
        );
        return command;
      }
    });
    this.client.log(
      `Successfully Loaded ${chalk.greenBright(this.commands.size)} Commands`
    );
  };

  loadFeatures = (): void => {
    this.client.log(chalk.green("Loading Features..."));
    this.client.setFeatures().then(() => {
      this.client.log(
        `Successfully Loaded ${chalk.greenBright(
          this.client.features.size
        )} Features`
      );
    });
  };

  parseArgs = (args: string[]): IParsedArgs => {
    const slicedArgs = args.slice(1);
    return {
      args: slicedArgs,
      flags: slicedArgs.filter((arg) => arg.startsWith("--")),
      joined: slicedArgs.join(" ").trim(),
    };
  };
}
