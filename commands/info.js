const Discord = require('discord.js');

exports.run = (client, message, args, lang, db, prefix) => {
    // Menu d'aide
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.INFO_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format: "png",
                    size:1024,
                    dynamic: true,
                }),
            },
            description: `${lang.INFO_HELP_USAGES}
» \`${prefix}info\` - ${lang.INFO_HELP}     
» \`${prefix}info latest\` - ${lang.INFO_HELP_LATEST}
» \`${prefix}info <Number>\` - ${lang.INFO_HELP_NUMBER}

Alias: \`i\` - \`infos\` - \`information\` - \`informations\``};

        // Envoie de l'erreur
        return message.channel.send({
            embed: HelpEmbed,
        })
            .catch(console.error);
    }

    db.query(`SELECT * FROM user_pokemon WHERE member_id = '${message.author.id}'`, (err1, rows1) => {
        let ErrorEmbed = {
            color: '#eb4d4b',
        }

        if (rows1.length < 1) {
            ErrorEmbed.description = lang.INFO_NO_POKEMON;
            return message.channel.send({
                embed: ErrorEmbed,
            })
                .catch(console.error);
        }

        db.query(`SELECT * FROM user_pokemon WHERE (member_id, selected) = ('${message.author.id}', 'select')`, (err1, rows2) => {
            let Pokemon;
            if (rows2.length < 1) {
                Pokemon = rows1[0].id;
            } else {
                Pokemon = rows2[0].id;
            }

            if (args[0]) {
                if (!isNaN(args[0])) {
                    let count = args[0] - 1;
                    if (rows1.length > count) {
                        Pokemon = rows1[count].id;
                    }
                }
            }

            if (args[0] === 'latest') {
                Pokemon = rows1[rows1.length - 1].id;
            }

            db.query(`SELECT * FROM user_pokemon WHERE id = '${Pokemon}'`, (err2, rows3) => {
                db.query(`SELECT * FROM translation WHERE pokemon_id = '${rows3[0].pokemon_id}'`, (err3, rows4) => {
                    db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${rows3[0].pokemon_id}'`, (err4, rows5) => {
                        let gen;
                        if (!['alolan', 'galarian'].includes(rows5[0].rarity)) {
                            if (rows3[0].pokemon_id < 152) {
                                gen = 'gen_1';
                            }

                            if (rows3[0].pokemon_id > 151 && rows3[0].pokemon_id < 252) {
                                gen = 'gen_2';
                            }

                            if (rows3[0].pokemon_id > 251 && rows3[0].pokemon_id < 387) {
                                gen = 'gen_3';
                            }

                            if (rows3[0].pokemon_id > 386 && rows3[0].pokemon_id < 494) {
                                gen = 'gen_4';
                            }

                            if (rows3[0].pokemon_id > 493 && rows3[0].pokemon_id < 650) {
                                gen = 'gen_5';
                            }

                            if (rows3[0].pokemon_id > 649 && rows3[0].pokemon_id < 722) {
                                gen = 'gen_6';
                            }

                            if (rows3[0].pokemon_id > 721 && rows3[0].pokemon_id < 810) {
                                gen = 'gen_7';
                            }

                            if (rows3[0].pokemon_id > 809 && rows3[0].pokemon_id < 891) {
                                gen = 'gen_8';
                            }
                        } else {
                            if (rows5[0].rarity === 'alolan') {
                                gen = 'alolan';
                            } else {
                                gen = 'galarian';
                            }
                        }

                        const file = new Discord.MessageAttachment(`./images/${gen}/${rows3[0].pokemon_id}.png`, 'awesome_pokemon.png');
                        let UserPoints = rows3[0].hp + rows3[0].attack + rows3[0].attack_spé + rows3[0].déf + rows3[0].déf_spé + rows3[0].speed;
                        let DefaultPoints = rows5[0].hp + rows5[0].attack + rows5[0].attack_spé + rows5[0].defense + rows5[0].defense_spe + rows5[0].speed;

                        let CheckEmbed = {
                            title: `Info - ${rows4[0].english}`,
                            description: `${lang.INFO_NAME} [**#${rows3[0].pokemon_id}**]:
» :flag_fr: ${rows4[0].french}
» :flag_jp: ${rows4[0].japanese}
» :flag_de: ${rows4[0].deutch}

Types :
» ${rows5[0].type_1}
${(rows5[0].type_2 !== null) ? `» ${rows5[0].type_2}\n` : ``}
${lang.INFO_STAT} [\`${lang.INFO_LEVEl} ${rows3[0].level}\` / \`${rows3[0].xp} XP\`] : **${Math.round((UserPoints/DefaultPoints)*10000)/100}% IV**
» Nature : ${rows3[0].nature}
» HP : ${rows3[0].hp} / **${rows5[0].hp}**
» ${lang.INFO_ATTACK} : ${rows3[0].attack} / **${rows5[0].attack}**
» ${lang.INFO_ATTACK_SPE} : ${rows3[0].attack_spé} / **${rows5[0].attack_spé}**
» ${lang.INFO_DEFENSE} : ${rows3[0].déf} / **${rows5[0].defense}**
» ${lang.INFO_DEFENSE_SPE} : ${rows3[0].déf_spé} / **${rows5[0].defense_spe}**
» ${lang.INFO_SPEED} : ${rows3[0].speed} / **${rows5[0].speed}**`,
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
                                text: `${rows1.findIndex(e => e.id === Pokemon)+1} / ${rows1.length}`,
                            },
                        };

                        // Envoie de la réponse
                        message.channel.send({
                            files: [file],
                            embed: CheckEmbed,
                        })
                            .catch(console.error);
                    });
                });
            });
        });
    });
}