const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/Schemas/Guild");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    Guild.findOne({ idS: message.guild.id }, async function (err, server) {
      try {
        if (message.author.bot) return; 
        const guild = message.guild;

        const UPDATE = new MessageEmbed()
          .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
          .setTitle(`Mensagem Deletada`)
          .addFields(
            {
              name: `Author`,
              value: message.author,
            },
            {
              name: `Contéudo da Mensagem`,
              value: message.content, 
            },
            {
              name: `Canal`,
              value: message.channel, 
            }
          )
          .setThumbnail(
            message.author.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setFooter(
            `${message.author.tag} | ${message.author.id}`,
            message.author.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setTimestamp()
          .setColor(process.env.EMBED_COLOR);

        if (server.logs.status) {
          const channel = guild.channels.cache.get(server.logs.channel);
          channel.send(UPDATE);
        }
      } catch (err) {
        console.log(`EVENTO: MessageDelete`);
      }
    });
  }
};