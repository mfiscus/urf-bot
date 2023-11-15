const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const { api } = require('../../config.json');


module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('lastheard')
        .setDescription('Provides information about the last heard operator.'),
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
        const [ stations ] = reflector.stations;

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
        .setURL(reflector.reflector.dashboard)
        .setAuthor({ name: `${reflector.reflector.comment}`, iconURL: 'https://xlx847.kk7mnz.com/img/logo.png', url: 'https://dev.chandlerhams.org' })
            .addFields(
                { name: 'Name', value: `${reflector.operators[0].fname + ' ' + reflector.operators[0].lname[0]}`, inline: true },
                { name: 'Callsign', value: `${reflector.operators[0].callsign}`, inline: true },
                { name: 'Via', value: `${reflector.operators[0].via}`, inline: true },
                { name: 'Peer', value: `${reflector.operators[0].peer}`, inline: true },
                { name: 'Module', value: `${reflector.operators[0].module}`, inline: true },
                { name: 'Last Heard', value: `${reflector.operators[0].lastheard}`, },
                
            )
        interaction.editReply({ embeds: [embed] });
    },
};