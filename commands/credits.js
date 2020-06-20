exports.run = (client, message, args, lang, db, prefix) => {
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.CREDITS_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format: "png",
                    size: 1024,
                    dynamic: true,
                }),
            },
            description: `${lang.CATCH_HELP_USAGES}
» \`${prefix}credits\` - ${lang.CREDITS_HELP}            
            
Alias: \`-\``};

        // Envoie de l'aide
        return message.channel.send({
            embed: HelpEmbed,
        })
            .catch(console.error);
    }

    let CheckEmbed = {
        title: lang.CREDIT_TITLE,
        description: `» [Logo - Toinoux]()
» [Emojis - NewHorizon](https://discord.gg/xD4FgQH)
» [Sources - Poképédia](https://www.pokepedia.fr/Portail:Accueil)`,
        thumbnail: {
            url: client.user.displayAvatarURL({
                format: "png",
                size: 1024,
                dynamic: true,
            }),
        }
    }
    message.channel.send({
        embed: CheckEmbed,
    })
        .catch(console.error);
};