import { AudioPlayerStatus, VoiceConnection, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import axios from "axios";
import { Readable } from "stream";
import { getAudioUrl } from "google-tts-api";
import { GuildAudio, VoiceSubcription } from "..";


export const textToSpeech = async (message: string, voiceConnection: VoiceConnection, guildId: string) => {
    const voiceURL = getAudioUrl(message, {
        lang: 'vi',
        slow: false,
        host: 'https://translate.google.com',
    });

    const { data } = await axios.get(voiceURL, {
        responseType: 'arraybuffer',
        headers: {
            "Content-Type": 'audio/mpeg'
        }
    })

    const player = createAudioPlayer();
    const streamData = Readable.from(data);
    const resource = createAudioResource(streamData);
    player.play(resource);

    const subcription = VoiceSubcription.get(voiceConnection);
    if(subcription){
        subcription.unsubscribe();
    }
    const newSubcription = voiceConnection.subscribe(player);
    player.once(AudioPlayerStatus.Idle, () => {
        if (newSubcription) {
            newSubcription.unsubscribe();
            const Player = GuildAudio.get(guildId);
            if (Player) {
                const subcription = voiceConnection.subscribe(Player.player);
                if (subcription) VoiceSubcription.set(voiceConnection, subcription);
            }
        }
    });
}