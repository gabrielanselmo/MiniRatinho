const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const ClientEmbed = require("../../structures/ClientEmbed");
const { WebhookClient } = require("discord.js");
const moment = require("moment");
const coldoown = new Set();
const c = require("colors");
let t;

module.exports = class messageCreate {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    moment.locale("pt-BR");

    try {
      const server = await this.client.database.guilds.findOne({
        idS: message.guild.id,
      });
      let user = await this.client.database.users.findOne({
        idU: message.author.id,
      });
      const client = await this.client.database.clientUtils.findOne({
        _id: this.client.user.id,
      });

      if (message.author.bot == true) return;

      const language = await this.client.getLanguage(message.guild.id);

      try {
        t = await this.client.getTranslate(message.guild.id);
      } catch (e) {
        console.log(e);
      }
      
      if (!user)
        await this.client.database.users.create({
          idU: message.author.id,
          idS: message.guild.id,
        });

      if (!server)
        await this.client.database.guilds.create({ idS: message.guild.id });
      if (!client)
        await this.client.database.clientUtils.create({
          _id: this.client.user.id,
          reason: "",
          manutenção: false,
        });

      var prefix = prefix;
      prefix = server.prefix;

      if (message.content.match(GetMention(this.client.user.id))) {
        message.reply(
          `Olá ${message.author}, meu prefixo no servidor é **${prefix}**.`
        );
      }

      user = await this.client.database.users.findOne({
        idU: message.author.id,
      });

      let xp = user.Exp.xp;
      let level = user.Exp.level;
      let nextLevel = user.Exp.nextLevel * level;

      if (user.Exp.id == "null") {
        await this.client.database.users.findOneAndUpdate(
          { idU: message.author.id },
          { $set: { "Exp.id": message.author.id } }
        );
      }

      let xpGive = Math.floor(Math.random() * 5) + 1;

      await this.client.database.users.findOneAndUpdate(
        { idU: message.author.id },
        {
          $set: {
            "Exp.xp": xp + xpGive,
            "Exp.user": message.author.tag,
          },
        }
      );

      if (xp >= nextLevel) {
        await this.client.database.users.findOneAndUpdate(
          { idU: message.author.id },
          { $set: { "Exp.xp": 0, "Exp.level": level + 1 } }
        );

        message.reply(
          `${message.author}, você acaba de subir para o level **${
            level + 1
          }**.`
        );
        message.react("⬆️");
      }

      if (message.content.indexOf(prefix) !== 0) return;
      const author = message.author;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command));

      if (!cmd) return;
      if (coldoown.has(message.author.id))
        return message.reply(
          `${message.author}, você deve aguardar **5 segundos** para usar outro comando.`
        );

      const comando = await this.client.database.commands.findOne({
        _id: cmd.name,
      });

      if (comando) {
        if (message.author.id !== process.env.OWNER_ID) {
          if (comando.manutenção)
            return message.reply(
              `${message.author}, o comando **\`${cmd.name}\`** está em manutenção no momento.\nMotivo: **${comando.reason}**`
            );

          if (client.manutenção) {
            return message.reply(
              `${message.author}, no momento eu me encontro em manutenção, tente novamente mais tarde.\nMotivo: **${client.reason}**`
            );
          }
        }
        if (client.blacklist.some((x) => x == message.author.id)) {
          return message.reply(
            `${message.author}, você não pode usar meus comandos por estar na **\`Lista Negra\`**.`
          );
        }

        const cb = server.cmdblock;

        if (cb.status) {
          if (!cb.cmds.some((x) => x === cmd.name)) {
            if (!cb.channels.some((x) => x === message.channel.id)) {
              if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                return message.reply(cb.msg);
              }
            }
          }
        }

        cmd.run({ message, args, prefix, author, language }, t);
        var num = comando.usages;
        num = num + 1;

        const Webhook = new WebhookClient(
          process.env.WEBHOOK_ID,
          process.env.WEBHOOK_CHAVE
        );
        const EMBED_COMMANDS = new ClientEmbed(this.client.user)
          .setAuthor(
            `Logs de Comandos do Bot`,
            this.client.user.displayAvatarURL()
          )
          .addFields(
            {
              name: `Quem usou`,
              value: `**${message.author.tag}** \`( ${message.author.id} )\``,
            },
            {
              name: `Quando usou`,
              value: moment(Date.now()).format("L LT"),
            },
            {
              name: `O que foi executado`,
              value: `**\`${cmd.name} ${args.join(" ")}\`**`,
            }
          )
          .setTimestamp()
          .setFooter(
            message.author.id,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(
            this.client.user.displayAvatarURL({ format: "jpg", size: 2048 })
          );
        Webhook.send(EMBED_COMMANDS); 


        if (![process.env.OWNER_ID].includes(message.author.id)) {
          coldoown.add(message.author.id);
          setTimeout(() => {
            coldoown.delete(message.author.id);
          }, 5000);
        }
        await this.client.database.commands.findOneAndUpdate(
          { _id: cmd.name },
          { $set: { usages: num } }
        );
      } else {
        await this.client.database.commands.create({
          _id: cmd.name,
          usages: 1,
          manutenção: false,
        });

        console.log(
          c.cyan(
            `[Comando] - O comando: (${cmd.name}) foi cadastrado com sucesso!`
          )
        );
        message.reply(`[Comando] - O comando: (${cmd.name}) foi cadastrado com sucesso. Por favor, use novamente.`)
      }
    } catch (err) {
      if (err) console.error(err);
    }
  }
};