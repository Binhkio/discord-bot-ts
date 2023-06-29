import { ActionRowBuilder, ButtonBuilder, Embed, EmbedBuilder, Interaction, Message, TextChannel } from "discord.js";
import { VoiceConnection, VoiceConnectionStatus, entersState, getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import config from "../config";
import { GuildAudio, client } from "..";
import { handleGreetJoin } from "./time";

export const handleJoinChannelByInteraction = async (interaction: Interaction) => {
    if (!interaction.channel || !interaction.guild) return;
    const guild = interaction.guild;
    const channel = guild.members.cache.get(interaction.user.id)?.voice.channel;

    if (!channel) return;
    if (channel?.members.get(config.CLIENT_ID)) {
        return getVoiceConnection(channel.guildId);
    }
    
    const initialVoiceConnection = joinVoiceChannel({
        guildId: guild.id,
        channelId: channel.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
    });

    const voiceConnection = await entersState(initialVoiceConnection, VoiceConnectionStatus.Ready, 5e3);

    await handleGreetJoin("cả nhà", voiceConnection, guild.id);
    console.log(`Join voice channel: ${channel.id}`);

    return voiceConnection;
}

export const handleSendEmbed = async (channel_id: string, embed: EmbedBuilder, action?: ActionRowBuilder<ButtonBuilder>) => {
    const channel = client.channels.cache.get(channel_id) as TextChannel;
    if (!channel) return;
    return await channel.send({
        embeds: [embed],
        components: action ? [action] : [],
    });
}

export const handleChangeActionRow = (interaction: Interaction, action?: ActionRowBuilder<ButtonBuilder>) => {
    if (interaction.isButton()) {
        return interaction.update({
            embeds: interaction.message.embeds,
            components: action ? [action] : [],
        })
    }
}

export const handleDisconnect = (guildId: string, voiceConnection: VoiceConnection) => {
    const Player = GuildAudio.get(guildId)?.player;
    if (Player) Player.stop();
    voiceConnection.destroy();
    GuildAudio.delete(guildId);
}