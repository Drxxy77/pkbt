exports.run = (client, message, args, lang, db, prefix) => {
    let TopArray = [];
    let TitleType = 'All catches';

    // Menu d'aide
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.TOP_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: `${client.user.displayAvatarURL({format:"png", size:1024, dynamic: true})}`
            },
            description: `${lang.TOP_HELP_USAGES}
» \`${prefix}leaderboard\` - ${lang.TOP_HELP_CATCH}            
» \`${prefix}leaderboard *${lang.TOP_HELP_RARITY}\` - ${lang.TOP_HELP_RARITY_2} \n_[legendary, mythical, ultrabeast, alolan, galarian]_
            
Alias: \`top\` - \`classement\` - \`lb\``
        };

        return message.channel.send({
            embed: HelpEmbed,
        })
            .catch(console.error);
    }

    db.query(`SELECT * FROM users`, (err, rows) => {
        rows.forEach(e => {
            if (!args[0] || !['legendary', 'mythical', 'ultrabeast', 'galarian', 'alolan'].includes(args[0])) {
                db.query(`SELECT * FROM user_pokemon WHERE member_id = '${e.userID}'`, (err1, rows1) => {
                    TopArray.unshift([
                        `${e.userID}`,
                        {
                            count: `${rows1.length}`,
                        }
                    ]);
                });
            }

            if (args[0] === "legendary") {
                TitleType = 'Legendary';
                db.query(`SELECT * FROM user_pokemon WHERE member_id = '${e.userID}'`, (err2, rows2) => {
                    let count = 0;
                    rows2.forEach(element => {
                        db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${element.pokemon_id}'`, (err3, rows3) => {
                            if (rows3[0].rarity === "legendary") {
                                if (!TopArray.find(u => u[0] === e.userID)) {
                                    TopArray.unshift([
                                        `${e.userID}`,
                                        {
                                            count: 1,
                                        }
                                    ]);
                                } else {
                                    TopArray.find(u => u[0] === e.userID)[1].count = TopArray.find(u => u[0] === e.userID)[1].count + 1
                                }
                            }
                        });
                    });
                });
            }

            if (args[0] === "mythical") {
                TitleType = 'Mythical';
                db.query(`SELECT * FROM user_pokemon WHERE member_id = '${e.userID}'`, async (err4, rows4) => {
                    rows4.forEach(element => {
                        db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${element.pokemon_id}'`, (err5, rows5) => {
                            if (rows5[0].rarity === "mythical") {
                                if (!TopArray.find(u => u[0] === e.userID)) {
                                    TopArray.unshift([
                                        `${e.userID}`,
                                        {
                                            count: 1,
                                        }
                                    ]);
                                } else {
                                    TopArray.find(u => u[0] === e.userID)[1].count = TopArray.find(u => u[0] === e.userID)[1].count + 1
                                }
                            }
                        });
                    });
                });
            }

            if (args[0] === "galarian") {
                TitleType = 'Galarian';
                db.query(`SELECT * FROM user_pokemon WHERE member_id = '${e.userID}'`, async (error, result) => {
                    let count = 0;
                    result.forEach(element => {
                        db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${element.pokemon_id}'`, (err1, result1) => {
                            if (result1[0].rarity === "galarian") {
                                count = count + 1;
                            }

                            if (!TopArray.find(u => u[0] === e.userID)) {
                                TopArray.unshift([
                                    `${e.userID}`,
                                    {
                                        count: 1,
                                    }
                                ]);
                            } else {
                                TopArray.find(u => u[0] === e.userID)[1].count = TopArray.find(u => u[0] === e.userID)[1].count + 1
                            }
                        });
                    });
                });
            }

            if (args[0] === "alolan") {
                TitleType = 'Alolan';
                db.query(`SELECT * FROM user_pokemon WHERE member_id = '${e.userID}'`, async (error, result) => {
                    let count = 0;
                    result.forEach(element => {
                        db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${element.pokemon_id}'`, (err1, result1) => {
                            if (result1[0].rarity === "alolan") {
                                count = count + 1;
                            }

                            if (!TopArray.find(u => u[0] === e.userID)) {
                                TopArray.unshift([
                                    `${e.userID}`,
                                    {
                                        count: 1,
                                    }
                                ]);
                            } else {
                                TopArray.find(u => u[0] === e.userID)[1].count = TopArray.find(u => u[0] === e.userID)[1].count + 1
                            }
                        });
                    });
                });
            }

            if (args[0] === "ultrabeast") {
                TitleType = 'Ultra Beast';
                db.query(`SELECT * FROM user_pokemon WHERE member_id = '${e.userID}'`, async (error, result) => {
                    let count = 0;
                    result.forEach(element => {
                        db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${element.pokemon_id}'`, (err1, result1) => {
                            if (result1[0].rarity === "Ultra Beast") {
                                count = count + 1;
                            }
                            if (!TopArray.find(u => u[0] === e.userID)) {
                                TopArray.unshift([
                                    `${e.userID}`,
                                    {
                                        count: 1,
                                    }
                                ]);
                            } else {
                                TopArray.find(u => u[0] === e.userID)[1].count = TopArray.find(u => u[0] === e.userID)[1].count + 1
                            }
                        });
                    });
                })
            }
        });

        setTimeout(() => {
            let TopEmbed = {
                title: `Top 10 - ${TitleType}`,
                color: `#15ffa4`,
                description: `${lang.TOP_EMBED_DESC} **${(TitleType !== 'All catches') ? `${TitleType}** ${lang.TOP_EMBED_CATCH}` : `${TitleType}**`}! <:SnapUmbreon:718281051742666803>

${TopArray.sort((a, b) => b[1].count - a[1].count).slice(0, 3).map(e => `<:star:715015039945539585> ${client.users.cache.find(u => u.id === e[0]).username} : **${e[1].count} pokemons**`).join('\n')}
${TopArray.sort((a, b) => b[1].count - a[1].count).slice(3, 9).map(e => `» ${client.users.cache.find(u => u.id === e[0]).username} : **${e[1].count} pokemons**`).join('\n')}`,
                thumbnail: {
                    url: `${TopArray.sort((a, b) => b[1].count - a[1].count).slice(0, 1).map(e => `${client.users.cache.find(u => u.id === e[0]).displayAvatarURL({format: 'png', size:1024, dynamic: true})}`)[0]}`,
                },
            };

            // Envoie de la réponse
            message.channel.send({
                embed:TopEmbed,
            })
                .catch(console.error);
        }, 250);
    });
}