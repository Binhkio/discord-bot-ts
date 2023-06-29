import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction } from "discord.js";
import { GuildAudio } from "../../..";
import { handleChangeActionRow } from "../../../service/channel";

export const ButtonResume = new ButtonBuilder()
    .setCustomId("resume")
    .setEmoji("▶️")
    .setLabel("Resume")
    .setStyle(ButtonStyle.Secondary);

export const ButtonPause = new ButtonBuilder()
    .setCustomId("pause")
    .setEmoji("⏸️")
    .setLabel("Pause")
    .setStyle(ButtonStyle.Secondary);

export const ButtonSkip = new ButtonBuilder()
    .setCustomId("skip")
    .setEmoji("⏭️")
    .setLabel("Skip")
    .setStyle(ButtonStyle.Secondary);

export const ButtonStop = new ButtonBuilder()
    .setCustomId("stop")
    .setEmoji("⏹️")
    .setLabel("Stop")
    .setStyle(ButtonStyle.Secondary);

export const PlayingActionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(ButtonPause, ButtonSkip, ButtonStop);

export const PausingActionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(ButtonResume, ButtonSkip, ButtonStop);

export const ButtonControll = async (interaction: Interaction) => {
    if (interaction.isButton()) {
        const custom_id = interaction.customId;
        const Player = GuildAudio.get(interaction.guildId);
        if (!Player) await interaction.reply(`No availble player`);
        else {
            switch(custom_id) {
                case "resume":
                    await Player.resume();
                    await handleChangeActionRow(interaction, PlayingActionRow);
                    break;
                case "pause":
                    await Player.pause();
                    await handleChangeActionRow(interaction, PausingActionRow);
                    break;
                case "skip":
                    await handleChangeActionRow(interaction);
                    await Player.skip();
                    break;
                case "stop":
                    await handleChangeActionRow(interaction);
                    await Player.stop();
                    break;
                default:
                    break;
            }
        }
    }
}