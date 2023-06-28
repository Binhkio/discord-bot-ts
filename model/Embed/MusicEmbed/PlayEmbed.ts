import { EmbedBuilder } from "discord.js";
import ytb from "../../../service/ytb";
import { client } from "../../..";


export const PlayEmbed = async (url: string, user_id: string) => {
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
            name: "🔥 ĐANG PHÁT 🔥",
            iconURL: user.avatarURL({ extension:'png' }) || "",
        })
        .setTitle('🎶🎶 ' + title)
        .setColor('Blue')
        .setImage(video.thumbnails[0].url)
        .setURL(video.url)
        // .setDescription(`👀 Lượt xem: ${videoDetails.views}`)
        .addFields({ name: '🏷️ Nguồn', value: `\`${video.channel?.name}\``, inline: true })
        .addFields({ name: '📢 Người thêm', value: `\`${user.username}\``, inline: true })
        .addFields({ name: '🕖 Thời lượng', value: `\`${video.durationRaw}\``, inline: true })
        .setTimestamp()
        .setFooter({text: "_Developed by Binhkio_"})
    return embed
}