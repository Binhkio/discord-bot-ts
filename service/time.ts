import { VoiceConnection } from "@discordjs/voice";
import { textToSpeech } from "./tts";

export const calcTime = (offset: number) => {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));
    return nd.getHours();
}

export const handleGreetJoin = async (name: string, voiceConnection: VoiceConnection, guildId: string) => {
    const vnOffset = 7;
    const nowHour = calcTime(vnOffset);
    console.log(nowHour);
    const greetingTime = nowHour < 12 ? 'buổi sáng' : nowHour < 18 ? 'buổi chiều' : 'buổi tối';
    const greeting = `Chào ${greetingTime} ${name}`;
    await textToSpeech(greeting, voiceConnection, guildId);
}

export const handleGreetLeave = async (name: string, voiceConnection: VoiceConnection, guildId: string) => {
    const greeting = `Tạm biệt ${name}`;
    await textToSpeech(greeting, voiceConnection, guildId);
}