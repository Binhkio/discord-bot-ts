import { Interaction } from "discord.js";
import { handleJoinChannelByInteraction } from "../service/channel";

const join = async (interaction: Interaction) => {
    const voiceConnection = await handleJoinChannelByInteraction(interaction);
    
    if (interaction.isRepliable()) {
        if (!voiceConnection) {
            return await interaction.editReply("Can not create a voice connection!");
        }
        return await interaction.editReply("Connected to voice channel!");
    }
}

export default join;