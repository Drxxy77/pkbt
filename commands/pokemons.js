exports.run = (client, message, args, lang, db, prefix) => {
    // Menu d'aide
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.POKEMONS_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format: "png",
                    size: 1024,
                    dynamic: true,
                }),
            },
            description: `${lang.TOP_HELP_USAGES}
» \`${prefix}pokemons\` - ${lang.POKEMONS_HELP}
» \`${prefix}pokemons <Page>\` - ${lang.POKEMONS_HELP_SPECIFIC}              
            
Alias: \`pokémons\` - \`poké\` - \`poke\` - \`p\``};

        return message.channel.send({
            embed: HelpEmbed
        })
            .catch(console.error);
    }

    let ErrorEmbed = {
        color: '#eb4d4b'
    }

    db.query(`SELECT * FROM user_pokemon WHERE member_id = '${message.author.id}'`, (err1, rows1) => {
        db.query(`SELECT * FROM default_pokemon`, (err2, rows2) => {
            db.query(`SELECT * FROM translation`, (err3, rows3) => {
                if (rows1.length < 1) {
                    ErrorEmbed.description = lang.SELECT_NO_POKEMON;
                    return message.channel.send({
                        embed: ErrorEmbed
                    })
                        .catch(console.error);
                }

                let page = args[0];
                if (!page) {
                    page = 1;
                } else {
                    if (isNaN(page)) {
                        ErrorEmbed.description = lang.POKEMONS_NOT_INT;
                        return message.channel.send({
                            embed: ErrorEmbed
                        })
                            .catch(console.error);
                    }
                }

                if ((page-1)*20 > rows1.length) {
                    ErrorEmbed.description = lang.POKEMONS_NOT_MUCH;
                    return message.channel.send({
                        embed: ErrorEmbed
                    })
                        .catch(console.error);
                }

                let CheckEmbed = {
                    title: `Pokémons - ${message.author.tag}`,
                    color: `#c37dff`,
                    thumbnail: {
                        url: message.author.displayAvatarURL({
                            format: "png",
                            size: 1024,
                            dynamic: true,
                        }),
                    },
                    description: `${rows1.slice((page-1)*20, page*20).map(e => `#${rows1.findIndex(element => element.id === e.id)+1} - ${rows3.find(e1 => e1.pokemon_id === e.pokemon_id)['english']} (**${Math.round(((e.hp + e.attack + e.attack_spé + e.déf + e.déf_spé + e.speed) / (rows2.find(l => l.pokemon_id === e.pokemon_id)['hp'] + rows2.find(l => l.pokemon_id === e.pokemon_id)['attack'] + rows2.find(l => l.pokemon_id === e.pokemon_id)['attack_spé'] + rows2.find(l => l.pokemon_id === e.pokemon_id)['defense'] + rows2.find(l => l.pokemon_id === e.pokemon_id)['defense_spe'] + rows2.find(l => l.pokemon_id === e.pokemon_id)['speed'])) * 10000) / 100 }% IV**)`).join('\n')}`,
                    footer: {
                        text: `${rows1.length} Pokemons`,
                    },
                };

                // Envoie de la réponse
                message.channel.send({
                    embed: CheckEmbed,
                })
                    .catch(console.error);
            });
        });
    });
}