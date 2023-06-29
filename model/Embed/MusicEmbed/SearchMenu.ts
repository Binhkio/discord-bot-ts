import { ActionRowBuilder, Interaction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"
import { YouTubeVideo } from "play-dl"
import { handleJoinChannelByInteraction } from "../../../service/channel";
import { GuildAudio, VoiceSubcription } from "../../..";
import MusicPlayer from "../../MusicPlayer/MusicPlayer";
import { choosedEmbed } from "./SearchEmbed";

export const SearchMenu = (foundData: YouTubeVideo[]) => {
    const select = new StringSelectMenuBuilder()
        .setCustomId("menu")
        .setPlaceholder("Choose one...")
        .addOptions(foundData.map((data) => {
            const title = data.title 
                ? (data.title.length > 255 ? data.title?.slice(0,250).concat("...") : data.title)
                : "";
            return new StringSelectMenuOptionBuilder()
                .setLabel(title)
                .setValue(data.url)
        }))
    
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
}

export const MenuControll = async (interaction: Interaction) => {
    if (interaction.isStringSelectMenu()) {
        const custom_id = interaction.customId;
        const url = interaction.values[0];

        const embed = await choosedEmbed(interaction, url);
        await interaction.reply({
            embeds: [embed],
        });
        
        switch (custom_id) {
            case "menu":{
                const voiceConnection = await handleJoinChannelByInteraction(interaction);
                if (!voiceConnection) {
                    return await interaction.editReply(`No availble voice connection`);
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
                }
            }
            default:
                break;
        }
    }
}