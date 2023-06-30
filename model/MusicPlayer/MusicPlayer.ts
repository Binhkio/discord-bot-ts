import { AudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, createAudioPlayer } from "@discordjs/voice"
import ytb from "../../service/ytb";
import { Message } from "discord.js";
import { handleChangeActionRow, handleSendEmbed } from "../../service/channel";
import { PlayEmbed } from "../Embed/MusicEmbed/PlayEmbed";
import { PausingActionRow, PlayingActionRow } from "../Embed/MusicEmbed/PlayButton";
import { AddEmbed } from "../Embed/MusicEmbed/AddEmbed";
import { EndEmbed } from "../Embed/MusicEmbed/EndEmbed";

type Video = {
    url: string,
    user_id: string,
}

class MusicPlayer {
    player: AudioPlayer;
    queue: Video[];
    previousQueue: Video[];
    loop: boolean;
    status: "playing" | "idle" | "buffering" | "pause";
    channel_id: string;
    message: Message | null;

    constructor () {
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        
        this.status = "idle";
        this.queue = [];
        this.previousQueue = [];
        this.loop = false;
        this.channel_id = "";
        this.message = null;

        this.player.on(AudioPlayerStatus.Idle, () => {
            this.status = "idle";
            this.playNext();
        })
        this.player.on(AudioPlayerStatus.Playing, () => {
            this.status = "playing";
        })
    }

    async playNext() {
        if (this.loop === true) {
            const preUrl = this.previousQueue.shift();
            if (preUrl) this.queue.unshift(preUrl);
        }
        if (this.message && this.message.editable) {
            const endEmbed = await EndEmbed(this.previousQueue[0].url, this.previousQueue[0].user_id);
            await this.message.edit({
                embeds: [endEmbed],
                components: [],
            })
        }
        if (this.queue.length === 0) return this.player.stop();
        const curVideo = this.queue[0];
        const playable = await ytb.handlePlay(curVideo.url, this.player);
        if (playable) {
            const embed = await PlayEmbed(curVideo.url, curVideo.user_id);
            const mes = await handleSendEmbed(this.channel_id, embed, PlayingActionRow)
            
            if (mes) this.message = mes;

            const preUrl = this.queue.shift();
            if (preUrl) this.previousQueue.unshift(preUrl);

            return true;
        }
        return;
    }

    async handleAddQueue(url: string, user_id: string) {
        if (ytb.playdl.yt_validate(url) === "video" || url.includes("watch")) {
            if (url.includes("&")) url = url.split("&")[0];
            this.queue.push({ url, user_id });
            const embed = await AddEmbed("video", url, user_id);
            if (embed) await handleSendEmbed(this.channel_id, embed);
        }
        else if (ytb.playdl.yt_validate(url) === "playlist") {
            const listUrl = await ytb.handleGetListUrl(url);
            listUrl.forEach((url) => {
                this.queue.push({ url, user_id });
            });
            const embed = await AddEmbed("playlist", url, user_id);
            if (embed) await handleSendEmbed(this.channel_id, embed);
        }
        else {
            return {
                error: true,
                mes: "Unknown Youtube URL !!!",
            };
        }
        if (this.status === "idle") return this.playNext();
        return;
    }
    
    handleSearch(name: string) {
        const videos = ytb.handleSearch(name);
    }

    async pause() {
        return this.player.pause();
    }

    async resume() {
        return this.player.unpause();
    }

    async skip() {
        await this.playNext();
    }

    async stop() {
        this.player.stop();
        this.queue = [];
        await this.playNext();
        this.message = null;
    }
}

export default MusicPlayer;