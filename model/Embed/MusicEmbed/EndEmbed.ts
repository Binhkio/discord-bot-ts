import { EmbedBuilder } from "discord.js";
import ytb from "../../../service/ytb";
import { client } from "../../..";


export const EndEmbed = async (url: string, user_id: string) => {
    // Video details
    const videoInfo = await ytb.playdl.video_info(url);
    const video = videoInfo.video_details;
    const title = video.title 
        ? (video.title.length > 255 ? video.title?.slice(0,250).concat("...") : video.title)
        : "";
    // User info
    const user = await client.users.fetch(user_id);

    const embed = new EmbedBuilder()
        .setAuthor({
            name: "🔥 ĐÃ PHÁT 🔥",
            iconURL: user.avatarURL({ extension:'png' }) || undefined,
        })
        .setTitle(title)
        .setURL(video.url)
        .setColor('Blue')
        .setTimestamp()
        .setFooter({text: `_Developed by Binhkio_`})
    return embed
}