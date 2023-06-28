import { Interaction } from "discord.js";
import { GuildAudio } from "..";
import MusicPlayer from "../model/MusicPlayer/MusicPlayer";
import { handleJoinChannelByInteraction } from "../service/channel";

const resume = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const voiceConnection = await handleJoinChannelByInteraction(interaction);
    if (!voiceConnection || !GuildAudio.get(interaction.guildId)) {
        return await interaction.editReply(`No availble voice connection`);
    }

    const Player = GuildAudio.get(interaction.guildId);
    if (!Player) await interaction.editReply(`No availble player`);
    else {
        await Player.resume();

        if (interaction.isRepliable()) {
            await interaction.editReply(`Resume`);
        }
    }
}

export default resume;