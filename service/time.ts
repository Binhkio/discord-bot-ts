import { VoiceConnection } from "@discordjs/voice";
import { textToSpeech } from "./tts";

export const calcTime = (offset?: number) => {
    const curOffset = offset || 7;
    var now = new Date();
    return new Date(now.getTime() + curOffset * 60 * 60 * 1000);
}

export const handleGreetJoin = async (name: string, voiceConnection: VoiceConnection, guildId: string) => {
    const nowHour = new Date(calcTime()).getHours();
    console.log(nowHour);
    const greetingTime = nowHour < 12 ? 'buổi sáng' : nowHour < 18 ? 'buổi chiều' : 'buổi tối';
    const greeting = `Chào ${greetingTime} ${name}`;
    await textToSpeech(greeting, voiceConnection, guildId);
}

export const handleGreetLeave = async (name: string, voiceConnection: VoiceConnection, guildId: string) => {
    const greeting = `Tạm biệt ${name}`;
    await textToSpeech(greeting, voiceConnection, guildId);
}