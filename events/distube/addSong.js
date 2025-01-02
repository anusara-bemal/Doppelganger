const { EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const GSetup = new Database("./settings/models/setup.json", { databaseInObject: true });

module.exports = async (client, queue, song) => {

    const db = await GSetup.get(`${queue.textChannel.guild.id}_${client.user.id}`);
	if (db.setup_enable === true) return;

    const embed = new EmbedBuilder()
        .setDescription(`**PLAYING • [${song.name}](${song.url})**`)
        .setColor("#FF0000")
        .setThumbnail(`${queue.songs[0].thumbnail}`)
        .addFields({ name: 'Duration:', value: `${song.formattedDuration}`, inline: false })
        .addFields({ name: 'Uploader:', value: `${queue.songs[0].uploader.name}`, inline: true })
        .addFields({ name: 'Views', value: `${queue.songs[0].views}`, inline: true })
        .setImage("https://i.postimg.cc/XYFPkD8f/Media-220225-225641.gif")
        .setTimestamp()

    queue.textChannel.send({ content: ' ', embeds: [embed] })
}
