import { Interaction } from "discord.js";
import ping from "./ping";
import join from "./join";
import play from "./play";
import pause from "./pause";
import resume from "./resume";
import skip from "./skip";
import stop from "./stop";
import { ButtonControll } from "../model/Embed/MusicEmbed/PlayButton";
import { MenuControll } from "../model/Embed/MusicEmbed/SearchMenu";
import disconnect from "./disconnect";

const ExecuteByInteraction = async (interaction: Interaction) => {
    if (interaction.isButton()) {
        await ButtonControll(interaction);
    }

    if (interaction.isStringSelectMenu()) {
        await MenuControll(interaction);
    }

    if (!interaction.isChatInputCommand()) return;

    const cmdName = interaction.commandName;

    await interaction.deferReply();

    switch (cmdName) {
        case "ping":
            await ping(interaction);
            break;
        case "join":
            await join(interaction);
            break;
        case "play":
            await play(interaction);
            break;
        case "pause":
            await pause(interaction);
            break;
        case "resume":
            await resume(interaction);
            break;
        case "skip":
            await skip(interaction);
            break;
        case "stop":
        case "fuckoff":
            await stop(interaction);
            break;
        case "disconnect":
        case "leave":
            await disconnect(interaction);
            break;
        default:
            break;
    }
}

export default ExecuteByInteraction;