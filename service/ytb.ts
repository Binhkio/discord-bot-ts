import { AudioPlayer, createAudioResource } from "@discordjs/voice";
import playdl from "play-dl";

const handlePlay = async (url: string, player: AudioPlayer) => {
    if (playdl.yt_validate(url) !== "video") return;

    const stream = await playdl.stream(url);
    const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
    });
    player.play(resource);
    return true;
}

const handleGetListUrl = async (url: string) => {
    const playlist = await playdl.playlist_info(url);
    const videos = await playlist.all_videos();
    return videos.map((vid) => vid.url);
}

const handleSearch = async (name: string) => {
    const data = await playdl.search(name, {
        limit: 10,
        source: {
            youtube: "video",
        }
    });
    return data;
}

export default {
    playdl,
    handlePlay,
    handleGetListUrl,
    handleSearch,
}