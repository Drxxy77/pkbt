exports.run = (client, message, args, lang, db, prefix) => {
    //Utilisation de la base de données pour trouver le nombre d'utilisateur inscrit à Pikacord
    db.query(`SELECT * FROM users`, (err, rows) => {
        //Menu d'Aide
        if (args[0] === 'help') {
            let HelpEmbed = {
                title: `${lang.BOTINFO_HELP_TITLE}`,
                color: `#7f96ff`,
                thumbnail: {
                    url: client.user.displayAvatarURL({
                        format: "png",
                        size: 1024,
                        dynamic: true,
                    }),
                },
                description: `${lang.BOTINFO_HELP_USAGES}
» \`${prefix}botinfo\` - ${lang.BOTINFO_HELP}            
            
Alias: \`bi\``};

            // Envoie de l'aide
            return message.channel.send({
                embed: HelpEmbed,
            })
                .catch(console.error);
        }


        //Commande principale
        let Version = client.channels.cache.find(c => c.id === '717414626010202264').name.slice(9); //Comparaison avec le salon sur le serveur support
        let Embed = {
            title: `Pikacord ${Version} - ${message.author.tag}`,
            color: `#8df8ff`,
            fields: [
                {
                    name: `<a:ItemHeart:720071495958659179> ${lang.BOTINFO_DETAILS}`,
                    value: `» ${client.guilds.cache.size} ${lang.BOTINFO_SERVERS}
» ${client.users.cache.size} ${lang.BOTINFO_USERS} _(${client.users.cache.filter(e => e.presence.status !== 'offline').size} ${lang.BOTINFO_USERS_CONNNECTED})_
» **${rows.length}** ${lang.BOTINFO_ACCOUNT}`,
                    inline: true
                },
                {
                    name: `<a:connected:720071351171285007> Ping`,
                    value: `${client.ws.ping}ms`,
                    inline: true,
                }
            ],
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format:"png",
                    dynamic: true,
                    size:1024,
                }),
            },
            timestamp: new Date(),
            footer: {
                text: `${prefix}credits`,
                iconURL: client.user.displayAvatarURL({
                    format: "png",
                    dynamic: true,
                    size: 64,
                }),
            },
        };

        //Envoie de la réponse
        message.channel.send({
            embed: Embed,
        })
            .catch(console.error);
    });
};