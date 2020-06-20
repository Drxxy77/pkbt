exports.run = (client, message, args, lang, db, prefix) => {
    // Menu d'aide
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.SELECT_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: `${client.user.displayAvatarURL({format:"png", size:1024, dynamic: true})}`
            },
            description: `${lang.BOTINFO_HELP_USAGES}
» \`${prefix}select <Number>\` - ${lang.SELECT_HELP}           
            
Alias: \`-\``};

        return message.channel.send({
            embed: HelpEmbed
        });
    }

    let target = args[0];
    let ErrorEmbed = {
        color: '#eb4d4b',
    }

    if (!target) {
        ErrorEmbed.description = lang.SELECT_NO_ARG;
        return message.channel.send({
            embed: ErrorEmbed,
        });
    }

    if (isNaN(target)) {
        ErrorEmbed.description = lang.SELECT_NOT_INT;
        return message.channel.send({
            embed: ErrorEmbed,
        });
    }

    db.query(`SELECT * FROM user_pokemon WHERE member_id = '${message.author.id}'`, (err, rows) => {
        if (rows.length < 1) {
            ErrorEmbed.description = lang.SELECT_NO_POKEMON;
            return message.channel.send({
                embed: ErrorEmbed,
            });
        }

        if (rows.length < target) {
            ErrorEmbed.description = lang.SELECT_NOT_MUCH;
            return message.channel.send({
                embed: ErrorEmbed,
            });
        }

        db.query(`SELECT * FROM user_pokemon WHERE (selected, member_id) = ('select', '${message.author.id}')`, (error, rows1) => {
            if (rows1.length > 0) {
                db.query(`UPDATE user_pokemon SET selected = null WHERE id = '${rows1[0].id}'`);
                db.query(`UPDATE user_pokemon SET selected = 'select' WHERE id = '${rows[target-1].id}'`);
            } else {
                db.query(`UPDATE user_pokemon SET selected = 'select' WHERE id = '${rows[target-1].id}'`);
            }

            let SelectEmbed = {
                author: {
                    text: message.author.tag,
                    iconURL: message.author.displayAvatarURL({
                        size: 64,
                        format: "png",
                        dynamic: true,
                    }),
                },
                description: `${lang.SELECT_END}`,
                color: `#635ecd`,
            };


            // Envoie de la réponse
            message.channel.send({
                embed: SelectEmbed
            })
                .catch(console.error);
        });
    });
}