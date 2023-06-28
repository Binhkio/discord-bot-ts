import { EmbedBuilder, Interaction } from "discord.js"
import { YouTubeVideo } from "play-dl";
import ytb from "../../../service/ytb";

export const searchEmbed = async (interaction: Interaction, foundData: YouTubeVideo[]) => {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: "SEARCH",
            iconURL: interaction.user.avatarURL({extension:"png"}) || "",
        })
        .setDescription(`Choose one from these ${foundData.length} result(s).`)
        .setFooter({text: "_Developed by Binhkio_"})
        .setTimestamp()
        return embed
}

export const choosedEmbed = async (interaction: Interaction, url: string) => {
    const data = await ytb.playdl.video_info(url);
    const video = data.video_details;
    const title = video.title
        ? (video.title.length > 30 ? video.title?.slice(0,20).concat("...") : video.title)
        : "";
    const embed = new EmbedBuilder()
        .setAuthor({
            name: "CHOOSED",
            iconURL: interaction.user.avatarURL({extension:"png"}) || "",
        })
        .setTitle(title)
        .setURL(video.url)
        .setFooter({text: "_Developed by Binhkio_"})
        .setTimestamp()

        return embed
}