const Discord = require('discord.js');

exports.run = (client, message, args, lang, db, prefix) => {
    // Menu d'aide
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.POKEDEX_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format:"png",
                    size:1024,
                    dynamic: true
                }),
            },
            description: `${lang.TOP_HELP_USAGES}
» \`${prefix}pokedex\` - ${lang.POKEDEX_HELP}
» \`${prefix}pokedex <Number>\` - ${lang.POKEDEX_HELP_SPECIFIC}              
            
Alias: \`dex\` - \`pokédex\``};

        return message.channel.send({
            embed: HelpEmbed,
        })
            .catch(console.error);
    }

    db.query(`SELECT * FROM caught`, (err1, rows1) => {
        db.query(`SELECT * FROM default_pokemon`, (err, rows) => {
            let target = args[0];
            let Pokemon = 1;
            if (target) {
                if (!isNaN(target)) {
                    if (0 < target && target < 891) {
                        Pokemon = parseInt(target);
                    }
                }
            }

            db.query(`SELECT * FROM translation WHERE pokemon_id = '${Pokemon}'`, (err2, rows2) => {
                let Search = rows.find(e => e.pokemon_id === Pokemon);
                let rarity = Search['rarity'];

                if (rows2.length > 1) {
                    let first;
                    let second;
                    let third;
                    if (rows.length === 2) {
                        first = rows2[0].english;
                        second = rows2[1].english;

                        message.channel.send(`» \`1\` - ${first}\n» \`2\` - ${second}`)
                            .then((msg) => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    time: 600000
                                }).then((collected1) => {
                                    if (collected1.first().content === '1') {
                                        rarity = rows[0].rarity;
                                    }

                                    if (collected1.first().content === '2') {
                                        rarity = rows[1].rarity;
                                    }
                                    msg.delete();
                                    collected1.first().delete()
                                        .catch(console.error);
                                });
                            });
                    }

                    if (rows.length === 3) {
                        first = rows2[0].english;
                        second = rows2[1].english;
                        third = rows2[2].english;

                        message.channel.send(`» \`1\` - ${first}\n» \`2\` - ${second}\n» \`3\` - ${third}`)
                            .then((msg) => {
                                message.channel.awaitMessages(m => m.author.id === message.author.id, {
                                    max: 1,
                                    time: 600000
                                }).then((collected2) => {
                                    if (collected2.first().content === '1') {
                                        rarity = rows[0].rarity;
                                    }

                                    if (collected2.first().content === '2') {
                                        rarity = rows[1].rarity;
                                    }

                                    if (collected2.first().content === '3') {
                                        rarity = rows[2].rarity;
                                    }
                                    msg.delete();
                                    collected2.first().delete()
                                        .catch(console.error)
                                });
                            });
                    }
                }

                db.query(`SELECT * FROM default_pokemon WHERE (pokemon_id, rarity) = ('${Pokemon}', '${rarity}')`, (err3, rows3) => {
                    let gen;
                    if (!['alolan', 'galarian'].includes(rarity)) {
                        if (Pokemon < 152) {
                            gen = 'gen_1';
                        }

                        if (Pokemon > 151 && Pokemon < 252) {
                            gen = 'gen_2';
                        }

                        if (Pokemon > 251 && Pokemon < 387) {
                            gen = 'gen_3';
                        }

                        if (Pokemon > 386 && Pokemon < 494) {
                            gen = 'gen_4';
                        }

                        if (Pokemon > 493 && Pokemon < 650) {
                            gen = 'gen_5';
                        }

                        if (Pokemon > 649 && Pokemon < 722) {
                            gen = 'gen_6';
                        }

                        if (Pokemon > 721 && Pokemon < 810) {
                            gen = 'gen_7';
                        }

                        if (Pokemon > 809 && Pokemon < 891) {
                            gen = 'gen_8';
                        }
                    } else {
                        if (rows3[0].rarity === 'alolan') {
                            gen = 'alolan';
                        } else {
                            gen = 'galarian';
                        }
                    }

                    let count = 0;
                    rows1.forEach(e => {
                        if (e.pokemon === rows2[0].english) {
                            count = e.counter;
                        }
                    });
                    const file = new Discord.MessageAttachment(`./images/${gen}/${Pokemon}.png`, 'awesome_pokemon.png');

                    let CheckEmbed = {
                        title: `Pokedex - ${rows2[0].english}`,
                        description: `${lang.INFO_NAME} [**#${Pokemon}**]:
» :flag_fr: ${rows2[0].french}
» :flag_jp: ${rows2[0].japanese}
» :flag_de: ${rows2[0].deutch}
                    
Types :
» ${rows3[0].type_1}
${(rows3[0].type_2 !== null) ? `» ${rows3[0].type_2}\n` : ``}
${lang.INFO_STAT} : 
» HP : ${rows3[0].hp}
» ${lang.INFO_ATTACK} : ${rows3[0].attack}
» ${lang.INFO_ATTACK_SPE} : ${rows3[0].attack_spé} 
» ${lang.INFO_DEFENSE} : ${rows3[0].defense} 
» ${lang.INFO_DEFENSE_SPE} : ${rows3[0].defense_spe} 
» ${lang.INFO_SPEED} : ${rows3[0].speed}`,
                        color: `RANDOM`,
                        thumbnail: {
                            url: message.author.displayAvatarURL({
                                format: "png",
                                size: 1024,
                                dynamic: true,
                            }),
                        },
                        image: {
                            url: 'attachment://awesome_pokemon.png',
                        },
                        footer: {
                            text: `${Pokemon} / 890 - ${(rows1.find(e => e.pokemon === rows2[0].english && e.member_id === message.author.id)) ? `${lang.POKEDEX_FIRST_CATCH.replace('{moment}', rows1.find(e => e.pokemon === rows2[0].english)['first_catch'])} - ${lang.POKEDEX_CATCH_NUMBER.replace('{number}', count)}` : `${lang.POKEDEX_NOT_CATCH}`}`
                        }
                    };

                    // Envoie de la réponse
                    message.channel.send({
                        files: [file],
                        embed: CheckEmbed,
                    })
                        .catch(console.error);
                });
            });
        })
    })
}