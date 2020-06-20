exports.run = (client, message, args, lang, db, prefix) => {
    //Embed - Défaut
    let Embed = {
        title: `${lang.HELP_TITLE} - ${message.author.tag}`,
        color: `#99faff`,
        thumbnail: {
            url: client.user.displayAvatarURL({
                size: 1024,
                format: "png",
                dynamic: true,
            }),
        },
        description: `${lang.HELP_DESC.replace('{prefix}', prefix).replace('{prefix}', prefix)}`, //* Il y a 2 fois la variables dans la description
        fields: [
            {
                name: `<:games:715015030357229589> ${lang.HELP_COMMANDS}`,
                value: `\`catch\` - \`info\` - \`pokedex\` - \`select\` - \`pokemons\`
\`botinfo\` - \`leaderboard\` - \`profile\``,
                inline: true,
            },
            {
                name: `<:music_folder:704322743948148807> ${lang.HELP_LINK}`,
                value: `» [Dashboard](https://pikacord.com/dashboard)
» [Website](https://pikacord.com/)
» [Support](https://discord.gg/M6BQpXN)
» [Bot link](https://discord.com/oauth2/authorize?client_id=716350383739633785&permissions=8&scope=bot)`,
                inline: true,
            },
        ],
        timestamp: new Date(),
        footer: {
            text: `© 2020 - Pikacord`,
            iconURL: client.user.displayAvatarURL({
                size: 64,
                dynamic: true,
                format: "png",
            }),
        },
    }

    //Embed - Staff
    if (message.member.hasPermission('MANAGE_GUILD')) {
        Embed.fields = [
            {
                name: `<:games:715015030357229589> ${lang.HELP_COMMANDS}`,
                value: `\`catch\` - \`info\` - \`pokedex\` - \`select\` - \`pokemons\`
\`botinfo\` - \`leaderboard\` - \`profile\``,
                inline: true,
            },
            {
                name: `<:music_folder:704322743948148807> ${lang.HELP_LINK}`,
                value: `» [Dashboard](https://pikacord.com/dashboard)
» [Website](https://pikacord.com/)
» [Support](https://discord.gg/M6BQpXN)
» [Bot link](https://discord.com/oauth2/authorize?client_id=716350383739633785&permissions=8&scope=bot)`,
                inline: true,
            },
            {
                name: `<:wumpus:715015039420989520> ${lang.HELP_MANAGE}`,
                value: `\`redirect\``
            }
        ];
    }
    message.channel.send({
        embed: Embed,
    })
        .catch(console.error);
};