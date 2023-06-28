import { ChannelType, SlashCommandBuilder } from "discord.js";

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping pong with the bot')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a voice channel')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say something in voice channel')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('Type what you want bot to say')
                .setRequired(true)
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search video on Youtube by name')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Name of Youtube video')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play single music or playlist by Youtube URL')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('URL of Youtube video or playlist')
                .setRequired(true)
        )
        .addBooleanOption(option => 
            option.setName('mixed')
                .setDescription('Use with mixed list: "TRUE" if you want to import all list')
        )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop play music')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('fuckoff')
        .setDescription('Stop play those fuvking music')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnect from current channel')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Disconnect from current channel')
        .toJSON(),
];

export default commands;