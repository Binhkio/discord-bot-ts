import { Interaction } from "discord.js";
import { GuildAudio, VoiceSubcription } from "..";
import MusicPlayer from "../model/MusicPlayer/MusicPlayer";
import { handleJoinChannelByInteraction } from "../service/channel";
import { searchEmbed } from "../model/Embed/MusicEmbed/SearchEmbed";
import ytb from "../service/ytb";
import { SearchMenu } from "../model/Embed/MusicEmbed/SearchMenu";

const play = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const url = interaction.options.getString("url");
    if (!url) return;

    const voiceConnection = await handleJoinChannelByInteraction(interaction);
    if (!voiceConnection) {
        return await interaction.editReply(`No availble voice connection`);
    }

    if (!url.includes("http")) {
        const data = await ytb.handleSearch(url);
        const embed = await searchEmbed(interaction, data);
        const menu = SearchMenu(data);
        return await interaction.editReply({
            embeds: [embed],
            components: [menu],
        });
    }

    if (!GuildAudio.get(interaction.guildId)) {
        const player = new MusicPlayer();
        GuildAudio.set(interaction.guildId, player);
    }
    const Player = GuildAudio.get(interaction.guildId);
    if (!Player) await interaction.editReply(`No availble player`);
    else {
        Player.channel_id = interaction.channelId;
        await Player.handleAddQueue(url, interaction.user.id);
        const subcription = voiceConnection.subscribe(Player.player);
        if (subcription) VoiceSubcription.set(voiceConnection, subcription);
        await interaction.deleteReply();
    }
}

export default play;