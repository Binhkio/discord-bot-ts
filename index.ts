import { Client, GatewayIntentBits, Message } from "discord.js";
import { keepAlive } from "./server";
import dotenv from "dotenv";
import { registerCommand } from "./register_command";
import config from "./config";
import ExecuteByInteraction from "./controller";
import { generateDependencyReport, getVoiceConnection } from "@discordjs/voice";
import MusicPlayer from "./model/MusicPlayer/MusicPlayer";

dotenv.config();

process.on('unhandledRejection', (reason, p) => {
    console.log("Reason", reason, "Promise", p);
}).on('uncaughtException', err => {
    console.log("uncaughtException", err);
})

console.log(generateDependencyReport());

keepAlive();

registerCommand();

//Invite link:  https://discord.com/api/oauth2/authorize?client_id=1123539025224015873&permissions=40132211370560&scope=bot

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

export const GuildAudio = new Map<string|null, MusicPlayer>();

client.on('ready', () => {
    console.log(`Log in as ${client.user?.tag}`);
})

client.on('voiceStateUpdate', (oldState, newState) => {
    const voiceConnection = oldState.guild.id ? getVoiceConnection(oldState.guild.id) : null;
    if (!voiceConnection) return;

    const members = oldState.channel?.members;

    if (members && members.size === 1 && members.get(config.CLIENT_ID)) {
        voiceConnection.destroy();
    }
});

client.on('interactionCreate', async (interaction) => {
    try {
        await ExecuteByInteraction(interaction);
    } catch (error) {
        console.log(error);        
    }
})

client.login(config.TOKEN);
