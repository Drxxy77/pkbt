const chalk = require('chalk');
const Discord = require('discord.js');
const config = require('../config.json');

module.exports = (client, db, message) => {
    let  lang = require('../langs/en');

    if (message.author.bot) {
        return;
    }

    if (message.channel.type === "dm") {
        return;
    }

    db.query(`SELECT * FROM users WHERE userID = '${message.author.id}'`, (err, rows) => {
        if (err) {
            return console.log(chalk.red(`[ERROR] Message-17 / Read users : ${err}`));
        }
        if (rows.length > 0) {
            if (rows[0].levelingTimer === null) {
                db.query(`UPDATE users SET levelingTimer = '${Date.now()}' WHERE userID = '${message.author.id}'`);
            } else {
                if (Date.now() - parseInt(rows[0].levelingTimer) >= 1000*60) {
                    db.query(`SELECT * FROM user_pokemon WHERE member_id = '${message.author.id}'`, (error, rows1) => {
                        if (rows1.length > 0) {
                            db.query(`SELECT * FROM user_pokemon WHERE (member_id, selected) = ('${message.author.id}', 'select')`, (err, result) => {
                                let Pokemon;
                                if (result.length < 1) {
                                    Pokemon = rows1[0].id;
                                } else {
                                    Pokemon = result[0].id;
                                }
                                db.query(`UPDATE users SET levelingTimer = '${Date.now()}' WHERE userID = '${message.author.id}'`);
                                db.query(`SELECT * FROM user_pokemon WHERE id = '${Pokemon}'`, (err, result) => {
                                    if (result.length > 0) {
                                        let AddingXP = Math.floor(Math.random()*25)+1;
                                        let CurrentXP = result[0].xp;
                                        let CurrentLevel = result[0].level;
                                        let PriceLevelUp = Math.round(Math.pow((CurrentLevel + 1) * 200, 1.005));

                                        if (CurrentLevel === 100) {
                                            PriceLevelUp = null;
                                        }

                                        if (AddingXP + CurrentXP >= PriceLevelUp && PriceLevelUp !== null) {
                                            db.query(`UPDATE user_pokemon SET level = '${CurrentLevel + 1}' WHERE id = '${Pokemon}'`);
                                            db.query(`SELECT * FROM translation WHERE pokemon_id = '${result[0].pokemon_id}'`, (err1, row2) => {
                                                let LevelUp = {
                                                    title: lang.LEVELUP_TITLE.replace('{user}', message.author.username),
                                                    description: lang.LEVELUP_DESC.replace('{level}', CurrentLevel+1).replace('{Pokemon}', row2[0].english).replace('{ID}', result[0].pokemon_id),
                                                    color: '#b086ff',
                                                    thumbnail: {
                                                        url: message.author.displayAvatarURL({
                                                            format: "png",
                                                            size: 1024,
                                                            dynamic: true})
                                                    }
                                                }
                                                message.channel.send({
                                                    embed: LevelUp,
                                                })
                                                    .then((msg) => {
                                                        msg.delete({
                                                            timeout: 5000,
                                                            reason: `Self-Deletion`,
                                                        });
                                                    });
                                            });
                                        }
                                        db.query(`UPDATE user_pokemon SET xp = '${CurrentXP+AddingXP}' WHERE id = '${Pokemon}'`);
                                    }
                                });
                            });
                        }
                    });
                }
            }
        }
    });

    db.query(`SELECT * FROM guilds WHERE guild_id = ${message.guild.id}`, (err, rows) => {
        if (err) {
            return console.log(chalk.red(`[ERROR] Message-17 / Read Guilds : ${err}`));
        }

        let prefix = rows[0].prefix;
        lang = require(`../langs/${rows[0].lang}.js`);

        db.query(`SELECT * FROM blocked_channels WHERE channel_id = '${message.channel.id}'`, (error, results) => {
            if (error) {
                return console.log(chalk.red(`[ERROR] Message-25 / Read blocked_channels : ${error}`));
            }

            if (results.length < 1) {
                let SendingChannel = message.guild.channels.cache.find(c => c.id === message.channel.id);

                if (message.guild.channels.cache.find(c => c.id === rows[0].redirect_channel)) {
                    SendingChannel = message.guild.channels.cache.find(c => c.id === rows[0].redirect_channel);
                }

                db.query(`SELECT * FROM spawns WHERE channel_id = '${SendingChannel.id}'`, (error1, results1) => {
                    if (error1) {
                        return console.log(chalk.red(`[ERROR] Message-37 / Read spawns : ${error1}`));
                    }

                    // Ce nombre va nous servir pour obtenir la rareté du pokémon à spawn
                    let rarityP = Math.round(Math.random() * 1000); // 0-1000
                    let rarityN = {
                        legendary: 3,
                        ultrachimere: 10,
                        mythique: 13,
                        alola: 28,
                        galar: 43,
                        default: 1000
                    };

                    let rarity = `${(rarityP < rarityN.legendary)
                        ? 'legendary'
                        : `${(rarityP < rarityN.ultrachimere)
                            ? 'Ultra Beast'
                            : `${(rarityP < rarityN.mythique)
                                ? 'mythical'
                                : `${(rarityP < rarityN.alola)
                                    ? 'alolan'
                                    : `${(rarityP < rarityN.galar)
                                        ? 'galarian' : `${(rarityP <= rarityN.default)
                                            ? 'default' : 'ERREUR'}`}`}`}`}`}`

                    db.query(`SELECT * FROM default_pokemon WHERE rarity = '${rarity}'`, (error6, rows2) => {
                        if (error6) {
                            return console.log(chalk.red(`[ERROR] Message-65 / Read default_pokemon : ${error6}`));
                        }

                        let PokemonNumber = Math.floor(Math.random() * rows2.length);
                        let SpawnCount = Math.floor(Math.random() * 25) + 1;

                        if (results1.length < 1) {
                            db.query(`INSERT INTO spawns (channel_id, spawn_count, cooldown) VALUES ('${SendingChannel.id}', '${SpawnCount}', '${Date.now()}')`, (error2) => {
                                if (error2) {
                                    return console.log(chalk.red(`[ERROR] Message-65 / Insert Spawns : ${error2}`));
                                }
                            });
                        } else {
                            let Cooldown = Date.now() - parseInt(results1[0].cooldown) >= 60000;
                            if (!Cooldown || message.content.includes('p!c ' || 'p!catch ')) {
                                return;
                            }

                            if (rows2[PokemonNumber] === undefined) {
                                return console.log(`Error «rows2[PokemonNumber] === undefined» (Message - 138) : PokemonID = ${PokemonNumber} - ${rarity} - ${rows2.length}`);
                            }

                            if (results1[0].spawn_count === 1) {
                                let gen;
                                if (!['alolan', 'galarian'].includes(rarity)) {
                                    if (rows2[PokemonNumber].pokemon_id < 152) {
                                        gen = 'gen_1';
                                    }

                                    if (rows2[PokemonNumber].pokemon_id > 151 && rows2[PokemonNumber].pokemon_id < 252) {
                                        gen = 'gen_2';
                                    }

                                    if (rows2[PokemonNumber].pokemon_id > 251 && rows2[PokemonNumber].pokemon_id < 387) {
                                        gen = 'gen_3';
                                    }

                                    if (rows2[PokemonNumber].pokemon_id > 386 && rows2[PokemonNumber].pokemon_id < 494) {
                                        gen = 'gen_4';
                                    }

                                    if (rows2[PokemonNumber].pokemon_id > 493 && rows2[PokemonNumber].pokemon_id < 650) {
                                        gen = 'gen_5';
                                    }

                                    if (rows2[PokemonNumber].pokemon_id > 649 && rows2[PokemonNumber].pokemon_id < 722) {
                                        gen = 'gen_6';
                                    }

                                    if (rows2[PokemonNumber].pokemon_id > 721 && rows2[PokemonNumber].pokemon_id < 810) {
                                        gen = 'gen_7';
                                    }

                                    if (rows2[PokemonNumber].pokemon_id > 809 && rows2[PokemonNumber].pokemon_id < 891) {
                                        gen = 'gen_8';
                                    }
                                    rarity = 'default';
                                } else {
                                    if (rarity === 'alolan') {
                                        gen = 'alolan';
                                    } else {
                                        gen = 'galarian';
                                    }
                                }

                                db.query(`UPDATE spawns SET status =  '${rows2[PokemonNumber].pokemon_id}', rarity = '${rarity}', cooldown = '${Date.now()}' WHERE channel_id = '${SendingChannel.id}'`, (error2) => {
                                    if (error2) {
                                        return console.log(chalk.red(`[ERROR] message-128 / update spawns : ${error2}`));
                                    }
                                });

                                db.query(`SELECT * FROM statistics ORDER BY id DESC`, (err5, rows5) => {
                                    if (err5) {
                                        return console.log(chalk.red(`[ERROR] message-134 / ready statistics : ${err5}`));
                                    }
                                    db.query(`UPDATE statistics SET spawns =  '${rows5[0].spawns + 1}' WHERE id = '${rows5[0].id}'`, (error3) => {
                                        if (error3) {
                                            return console.log(chalk.red(`[ERROR] message-138 / update stats spawns : ${error3}`));
                                        }
                                    });
                                });

                                const file = new Discord.MessageAttachment(`./images/${gen}/${rows2[PokemonNumber].pokemon_id}.png`, 'awesome_pokemon.png');

                                const SpawningEmbed = {
                                    title: `${lang.SPAWNING_TITLE}`,
                                    color: `#6ab04c`,
                                    image: {
                                        url: 'attachment://awesome_pokemon.png',
                                    },
                                    footer: {
                                        text: `${prefix}catch <Pokemon>`
                                    }
                                };

                                if (message.channel.permissionsFor(client.user).has('SEND_MESSAGES' && 'ATTACH_FILES')) {
                                    SendingChannel.send({files: [file], embed: SpawningEmbed});
                                }

                                db.query(`UPDATE spawns SET spawn_count = '${SpawnCount}' WHERE channel_id = '${SendingChannel.id}'`, (error3) => {
                                    if (error3) {
                                        return console.log(chalk.red(`[ERROR] message-162 / update spawn count #1 : ${error3}`));
                                    }
                                    console.log(chalk.magenta(`[SQL] Updated ${message.channel.name} (spawn) to the "spawns" table!`));
                                });
                            } else {
                                db.query(`UPDATE spawns SET spawn_count = '${(results1[0].spawn_count) - 1}' WHERE channel_id = '${SendingChannel.id}'`, (error5) => {
                                    if (error5) {
                                        return console.log(chalk.red(`[ERROR] message-169 / update spawn count #2 : ${error5}`));
                                    }
                                });
                            }
                        }
                    });
                });
            }
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            let command = args.shift().toLowerCase();
            let cmd = client.commands.get(command);

            if (!cmd) {
                config["alias"].forEach(e => {
                   if (e[1].includes(command)) {
                       command = e[0];
                       cmd = client.commands.get(e[0]);
                   }
                });
            }

            if (message.mentions.has(client.user.id) && !message.mentions.everyone) {
                const PrefixEmbed = {
                    color: `#42ff43`,
                    description: `${lang.PREFIX_REQUEST} : \`${prefix}\``
                }

                message.channel.send({embed: PrefixEmbed})
                    .then(() => console.log(chalk.blue(`[RUN] Prefix request - ${message.author.tag}`)));
            }

            if (message.content.indexOf(prefix) === 0 && cmd && message.channel.permissionsFor(client.user).has('SEND_MESSAGES' && 'ATTACH_FILES')) {
                db.query(`SELECT * FROM users WHERE userID = '${message.author.id}'`, (error6, result6) => {
                    if (error6) {
                        return console.log('Error : 194 MESSAGES');
                    }

                    if (result6.length < 1 && command !== 'start') {
                        let ErrorEmbed = {
                            color: '#eb4d4b',
                            description: lang.MESSAGE_NO_REGISTER.replace('{prefix}', prefix)
                        }
                        return message.channel.send({embed: ErrorEmbed});
                    }
                    console.log(chalk.blue(`[RUN] ${command} - ${message.author.tag}`));
                    cmd.run(client, message, args, lang, db, prefix);
                    if (message.deletable) {
                        message.delete();
                    }
                });
            }
        });
    });
}