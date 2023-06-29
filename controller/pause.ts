import { Interaction } from "discord.js";
import { GuildAudio } from "..";
import MusicPlayer from "../model/MusicPlayer/MusicPlayer";
import { handleChangeActionRow, handleJoinChannelByInteraction } from "../service/channel";
import { PausingActionRow } from "../model/Embed/MusicEmbed/PlayButton";

const pause = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const voiceConnection = await handleJoinChannelByInteraction(interaction);
    if (!voiceConnection || !GuildAudio.get(interaction.guildId)) {
        return await interaction.editReply(`No availble voice connection`);
    }

    const Player = GuildAudio.get(interaction.guildId);
    if (!Player) await interaction.editReply(`No availble player`);
    else {
        await Player.pause();
        await handleChangeActionRow(interaction, PausingActionRow);

        if (interaction.isRepliable()) {
            await interaction.editReply(`Pause`);
        }
    }
}

export default pause;