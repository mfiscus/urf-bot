const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const { api, url, icon } = require('../../config.json');


module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('stations')
        .setDescription('Provides information about stations connected to the reflector.'),
    async execute(interaction) {
        const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

        const {statusCode, headers, body} = await request(api);

        console.log('response received', statusCode)
        console.log('headers', headers)
        
        
        if (statusCode != 200) {
            return interaction.editReply(`API returned error ${statusCode}.`);
        }
        
        const reflector = await body.json();

        //const { operators } = reflector.operators;
        //const [ stations ] = reflector.stations;

        console.log('json', reflector)

        /*
        // Use embed object here
                  .addFields(
                { name: 'Name', value: `${stations.fname + ' ' + stations.lname[0]}` },
                { name: 'Callsign', value: `${stations.callsign}` },
                { name: 'connected', value: `${stations.connected}` },
                { name: 'lastheard', value: `${stations.lastheard}` },
                { name: 'module', value: `${stations.module}` },
                { name: 'protocol', value: `${stations.protocol}` },
            )
        */

        const embed = new EmbedBuilder()
            .setColor(0xEFFF00)
            .setTitle(reflector.reflector.name)
            .setURL(reflector.reflector.dashboard + '?show=repeaters')
            .setAuthor({ name: `${reflector.reflector.comment}`, iconURL: `${icon}`, url: `${url}` })
            .addFields(
                { name: 'Stations Connected', value: `${reflector.reflector.stations}` },
            )
        interaction.editReply({ embeds: [embed] });
    },
};