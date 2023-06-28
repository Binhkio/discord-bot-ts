import { Interaction } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

const stop = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const voiceConnection = interaction.guildId ? getVoiceConnection(interaction.guildId) : null;
    if (!voiceConnection) {
        return await interaction.editReply(`Bot is not in your channel`);
    }

    voiceConnection.destroy();
    if (interaction.isRepliable()) {
        await interaction.editReply(`Disconnect`);
    }
}

export default stop;