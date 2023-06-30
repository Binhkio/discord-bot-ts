import { EmbedBuilder } from "discord.js";
import ytb from "../../../service/ytb";
import { client } from "../../..";

type CustomType = "video" | "playlist"


export const AddEmbed = async (type: CustomType, url: string, user_id: string) => {
    // User info
    const user = await client.users.fetch(user_id);
    
    switch(type){
        case "video": {
            // Video details
            const videoInfo = await ytb.playdl.video_info(url);
            const video = videoInfo.video_details;
            const titleV = video.title 
                ? (video.title.length > 255 ? video.title?.slice(0,250).concat("...") : video.title)
                : "";
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "✅ THÊM NHẠC",
                    iconURL: user.avatarURL({ extension:"png" }) || undefined,
                })
                .setTitle('🎶🎶 ' + titleV)
                .setColor('Green')
                .setURL(video.url)
                // .setDescription(`👀 Lượt xem: ${video.views}`)
                .addFields({ name: '🏷️ Nguồn', value: `\`${video.channel?.name}\``, inline: true })
                .addFields({ name: '📢 Người thêm', value: `\`${user.username}\``, inline: true })
                .addFields({ name: '🕖 Thời lượng', value: `\`${video.durationRaw}\``, inline: true })
                .setTimestamp()
                .setFooter({text: `_Developed by Binhkio_`})
            return embed
        }
        case "playlist": {
            // List details
            const listInfo = await ytb.playdl.playlist_info(url);
            const titleL = listInfo.title 
                ? (listInfo.title.length > 255 ? listInfo.title?.slice(0,250).concat("...") : listInfo.title)
                : "";
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "✅ THÊM DANH SÁCH NHẠC",
                    iconURL: user.avatarURL({ extension:"png" }) || undefined,
                })
                .setTitle('💽 ' + titleL)
                .setColor('Green')
                .setURL(listInfo.url||"")
                // .setDescription(`👀 Lượt xem: ${listInfo.views}`)
                .addFields({ name: '🏷️ Nguồn', value: `\`${listInfo.channel?.name}\``, inline: true })
                .addFields({ name: '📢 Người thêm', value: `\`${user.username}\``, inline: true })
                .addFields({ name: '🎟️ Số lượng', value: `\`${listInfo.videoCount} bài\``, inline: true })
                .setTimestamp()
                .setFooter({text: `_Developed by Binhkio_`})
            return embed
        }
        default:
            return;
    }
}