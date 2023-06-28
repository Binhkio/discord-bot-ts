import { Interaction } from "discord.js";

const ping = async (interaction: Interaction) => {
    if (interaction.isRepliable()) {
        return interaction.editReply("Pong! Bot is still alive...");
    }
}

export default ping;