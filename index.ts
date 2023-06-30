import { Client, GatewayIntentBits, Message } from "discord.js";
import { keepAlive } from "./server";
import dotenv from "dotenv";
import { registerCommand } from "./register_command";
import config from "./config";
import ExecuteByInteraction from "./controller";
import { PlayerSubscription, VoiceConnection, generateDependencyReport, getVoiceConnection } from "@discordjs/voice";
import MusicPlayer from "./model/MusicPlayer/MusicPlayer";
import { handleGreetJoin, handleGreetLeave } from "./service/time";
import { handleDisconnect } from "./service/channel";
import { handleLogError } from "./service/error_log";

dotenv.config();

process.on('unhandledRejection', (reason, p) => {
    console.log("Reason", reason, "Promise", p);
}).on('uncaughtException', err => {
    handleLogError(err);
})

console.log(generateDependencyReport());

keepAlive();

// registerCommand();

//Invite link:  https://discord.com/api/oauth2/authorize?client_id=1123539025224015873&permissions=40132211370560&scope=bot

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

export const GuildAudio = new Map<string|null, MusicPlayer>();
export const VoiceSubcription = new Map<VoiceConnection, PlayerSubscription>();
const Destroyer = new Map<string, NodeJS.Timeout>();

client.on('ready', () => {
    console.log(`Log in as ${client.user?.tag}`);
})

client.on('voiceStateUpdate', (oldState, newState) => {
    const voiceConnection = oldState.guild.id ? getVoiceConnection(oldState.guild.id) : null;
    if (!voiceConnection) return;

    const oldMembers = oldState.channel?.members;
    const newMembers = newState.channel?.members;

    // Bot auto leave after 5 minutes nobody in channel
    if (oldMembers && oldMembers.size === 1 && oldMembers.get(config.CLIENT_ID)) {
        const destroy = setTimeout(() => {
            handleDisconnect(oldState.guild.id, voiceConnection);
        }, 1000*60 );
        Destroyer.set(oldState.guild.id, destroy);
    }

    // Bot has been kicked
    if (oldMembers && oldMembers.get(config.CLIENT_ID) && newMembers && !newMembers.get(config.CLIENT_ID)) {
        handleDisconnect(oldState.guild.id, voiceConnection);
    }    

    // Someone comeback when bot auto leave
    if (newMembers && newMembers.size === 2 && newMembers.get(config.CLIENT_ID)) {
        const destroyer = Destroyer.get(newState.guild.id);
        clearTimeout(destroyer);
        Destroyer.delete(newState.guild.id);
    }

    // Greeting when someong leaves
    if (oldMembers && oldMembers.get(config.CLIENT_ID) && oldState.channelId !== newState.channelId) {
        if (oldState.member?.nickname)
            handleGreetLeave(oldState.member.nickname, voiceConnection, oldState.guild.id);
    }
    
    // Greeting when someong joins
    if (newMembers && newMembers.get(config.CLIENT_ID) && oldState.channelId !== newState.channelId) {
        if (newState.member?.nickname)
            handleGreetJoin(newState.member.nickname, voiceConnection, newState.guild.id);
    }
});

client.on('interactionCreate', async (interaction) => {
    try {
        await ExecuteByInteraction(interaction);
    } catch (error) {
        if (interaction.isRepliable()) {
            if (interaction.deferred) {
                await interaction.editReply(`${error}`);
            }
            else {
                await interaction.reply(`${error}`);
            }
        }
        handleLogError(error);
    }
})

client.login(config.TOKEN);
