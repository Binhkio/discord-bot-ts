import { REST, Routes } from 'discord.js'
import commands from './commands';
import config from './config';

const rest = new REST({ version: '10' }).setToken(config.TOKEN);

export const registerCommand = async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(config.CLIENT_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}