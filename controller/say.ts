import { Interaction } from "discord.js";
import { GuildAudio } from "..";
import MusicPlayer from "../model/MusicPlayer/MusicPlayer";
import { handleChangeActionRow, handleJoinChannelByInteraction } from "../service/channel";
import { textToSpeech } from "../service/tts";

const say = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const content = interaction.options.getString("content");
    if (!content) {
        return await interaction.editReply(`No text to speech`);
    }
    console.log(`TTS: ${content}`);

    const voiceConnection = await handleJoinChannelByInteraction(interaction);
    if (!voiceConnection) {
        return await interaction.editReply(`No availble voice connection`);
    }

    if (interaction.guildId) {
        await textToSpeech(content, voiceConnection, interaction.guildId);
        return await interaction.editReply(content);
    }
}

export default say;