import { VoiceConnection } from "@discordjs/voice";
import { textToSpeech } from "./tts";

export const calcTime = (offset?: number) => {
    const curOffset = offset || 7;
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return utc + (3600000*curOffset);
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