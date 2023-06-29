import { Interaction } from "discord.js";
import { GuildAudio } from "..";
import MusicPlayer from "../model/MusicPlayer/MusicPlayer";
import { handleChangeActionRow, handleJoinChannelByInteraction } from "../service/channel";

const stop = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const voiceConnection = await handleJoinChannelByInteraction(interaction);
    if (!voiceConnection || !GuildAudio.get(interaction.guildId)) {
        return await interaction.editReply(`No availble voice connection`);
    }

    const Player = GuildAudio.get(interaction.guildId);
    if (!Player) await interaction.editReply(`No availble player`);
    else {
        await handleChangeActionRow(interaction);
        await Player.stop();

        if (interaction.isRepliable()) {
            await interaction.editReply(`Stop`);
        }
    }
}

export default stop;