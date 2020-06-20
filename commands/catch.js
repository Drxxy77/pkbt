const Discord = require('discord.js');

exports.run = (client, message, args, lang, db, prefix) => {
    // Menu d'aide
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.CATCH_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format: "png",
                    size: 1024,
                    dynamic: true,
                }),
            },
            description: `${lang.CATCH_HELP_USAGES}
» \`${prefix}catch <Pokemon>\` - ${lang.CATCH_HELP}            
            
Alias: \`c\``};

        // Envoie de l'aide
        return message.channel.send({
            embed: HelpEmbed,
        })
            .catch(console.error);
    }

    db.query(`SELECT * FROM spawns WHERE channel_id = '${message.channel.id}'`, (err, rows1) => {
        let ErrorEmbed = {
            color: '#eb4d4b',
        }

        if (rows1.length < 1) {
            ErrorEmbed.description = lang.CATCH_NO_SPAWN;
            return message.channel.send({
                embed: ErrorEmbed,
            })
                .catch(console.error);
        }

        if (rows1[0].status === 'nothing') {
            ErrorEmbed.description = lang.CATCH_NO_SPAWN;
            return message.channel.send({
                embed: ErrorEmbed,
            })
                .catch(console.error);
        }

        db.query(`SELECT * FROM translation WHERE (pokemon_id, rarity) = ('${rows1[0].status}', '${rows1[0].rarity}')`, (err, rows2) => {
            if (rows2.length < 1) {
                ErrorEmbed.description = lang.CATCH_NOT_ADD;
                return message.channel.send({
                    embed: ErrorEmbed,
                })
                    .then(msg => msg.delete({
                        timeout: 10000,
                        reason: 'Incorrect Pokémon',
                    }))
                    .catch(console.error);
            }
            let PokemonNames = [];
            PokemonNames.push(rows2[0].french.toLowerCase(), rows2[0].english.toLowerCase(), rows2[0].japanese, rows2[0].deutch.toLowerCase());

            let Cmd = `${prefix}catch `;
            if (message.content.includes(`${prefix}c `)) {
                Cmd = `${prefix}c `;
            }

            let target = message.content.replace(`${Cmd}`, '').toLowerCase();
            if (!target) {
                ErrorEmbed.description = lang.CATCH_INCORRECT;
                return message.channel.send({
                    embed: ErrorEmbed,
                })
                    .then(msg => msg.delete({
                        timeout: 10000,
                        reason: 'Incorrect Pokémon',
                    }))
                    .catch(console.error);
            }

            if (!PokemonNames.find(e => e === target)) {
                ErrorEmbed.description = lang.CATCH_INCORRECT;
                return message.channel.send({
                    embed: ErrorEmbed,
                })
                    .then(msg => msg.delete({
                        timeout: 10000,
                        reason: 'Incorrect Pokémon',
                    }))
                    .catch(console.error);
            }

            let CheckEmbed = {
                color: '#badc58',
                description: `${message.author}, ${lang.CATCH_CAPTURE} **${rows2[0].english}**!`
            }

            message.channel.send({
                embed: CheckEmbed,
            })
                .catch(console.error);

            db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${rows1[0].status}'`, (error, rows3) => {
                let Attack = Math.round(Math.random()*rows3[0].attack);
                let AttackSpe = Math.round(Math.random()*rows3[0].attack_spé);
                let Defense = Math.round(Math.random()*rows3[0].defense);
                let DefenseSpe = Math.round(Math.random()*rows3[0].defense_spe);
                let Speed = Math.round(Math.random()*rows3[0].speed);
                let HP = Math.round(Math.random()*rows3[0].hp);

                let Natures = ['Bold', 'Quirky', 'Brave', 'Calm', 'Quiet', 'Docile', 'Mild', 'Rash', 'Gentle', 'Hardy', 'Jolly', 'Lax', 'Impish', 'Sassy', 'Naughty', 'Modest', 'Naive', 'Hasty', 'Careful', 'Bashful', 'Relaxed', 'Adamant', 'Serious', 'Lonely', 'Timid'];
                let NatureChose = Math.floor(Math.random() * Natures.length);
                let Nature = Natures[NatureChose];

                if (Nature === 'Bold') {
                    Attack = Math.ceil( Attack - Attack*0.1);
                    Defense = Math.ceil(Defense + Defense*0.1);
                    if (Defense > rows3[0].defense) {
                        Defense = rows3[0].defense;
                    }
                }

                if (Nature === 'Brave') {
                    Speed = Math.ceil( Speed - Speed*0.1);
                    Attack = Math.ceil(Attack + Attack*0.1);
                    if (Attack > rows3[0].attack) {
                        Attack = rows3[0].attack;
                    }
                }

                if (Nature === 'Calm') {
                    Attack = Math.ceil( Attack - Attack*0.1);
                    DefenseSpe = Math.round(DefenseSpe + DefenseSpe*0.1);
                    if (DefenseSpe > rows3[0].defense_spe) {
                        DefenseSpe = rows3[0].defense_spe;
                    }
                }

                if (Nature === 'Quiet') {
                    Speed = Math.ceil( Speed - Speed*0.1);
                    AttackSpe = Math.round(AttackSpe + AttackSpe*0.1);
                    if (AttackSpe > rows3[0].attack_spé) {
                        AttackSpe = rows3[0].attack_spé;
                    }
                }

                if (Nature === 'Mild') {
                    Defense = Math.ceil( Defense - Defense*0.1);
                    AttackSpe = Math.round(AttackSpe + AttackSpe*0.1);
                    if (AttackSpe > rows3[0].attack_spé) {
                        AttackSpe = rows3[0].attack_spé;
                    }
                }

                if (Nature === 'Rash') {
                    DefenseSpe = Math.ceil( DefenseSpe - DefenseSpe*0.1);
                    AttackSpe = Math.round(AttackSpe + AttackSpe*0.1);
                    if (AttackSpe > rows3[0].attack_spé) {
                        AttackSpe = rows3[0].attack_spé;
                    }
                }

                if (Nature === 'Gentle') {
                    Defense = Math.ceil( Defense - Defense*0.1);
                    DefenseSpe = Math.round(DefenseSpe + DefenseSpe*0.1);
                    if (DefenseSpe > rows3[0].defense_spe) {
                        DefenseSpe = rows3[0].defense_spe;
                    }
                }

                if (Nature === 'Jolly') {
                    AttackSpe = Math.ceil( AttackSpe - AttackSpe*0.1);
                    Speed = Math.round(Speed + Speed*0.1);
                    if (Speed > rows3[0].speed) {
                        Speed = rows3[0].speed;
                    }
                }

                if (Nature === 'Lax') {
                    DefenseSpe = Math.ceil( DefenseSpe - DefenseSpe*0.1);
                    Defense = Math.round(Defense + Defense*0.1);
                    if (Defense > rows3[0].defense) {
                        Defense = rows3[0].defense;
                    }
                }

                if (Nature === 'Impish') {
                    AttackSpe = Math.ceil( AttackSpe - AttackSpe*0.1);
                    Defense = Math.round(Defense + Defense*0.1);
                    if (Defense > rows3[0].defense) {
                        Defense = rows3[0].defense;
                    }
                }

                if (Nature === 'Sassy') {
                    Speed = Math.ceil( Speed - Speed*0.1);
                    DefenseSpe = Math.round(DefenseSpe + DefenseSpe*0.1);
                    if (DefenseSpe > rows3[0].defense_spe) {
                        DefenseSpe = rows3[0].defense_spe;
                    }
                }

                if (Nature === 'Naughty') {
                    DefenseSpe = Math.ceil( DefenseSpe - DefenseSpe*0.1);
                    Attack = Math.ceil(Attack + Attack*0.1);
                    if (Attack > rows3[0].attack) {
                        Attack = rows3[0].attack;
                    }
                }

                if (Nature === 'Modest') {
                    Attack = Math.ceil( Attack - Attack*0.1);
                    AttackSpe = Math.round(AttackSpe + AttackSpe*0.1);
                    if (AttackSpe > rows3[0].attack_spé) {
                        AttackSpe = rows3[0].attack_spé;
                    }
                }

                if (Nature === 'Naive') {
                    DefenseSpe = Math.ceil( DefenseSpe - DefenseSpe*0.1);
                    Speed = Math.round(Speed + Speed*0.1);
                    if (Speed > rows3[0].speed) {
                        Speed = rows3[0].speed;
                    }
                }

                if (Nature === 'Hasty') {
                    Defense = Math.ceil( Defense - Defense*0.1);
                    Speed = Math.round(Speed + Speed*0.1);
                    if (Speed > rows3[0].speed) {
                        Speed = rows3[0].speed;
                    }
                }

                if (Nature === 'Careful') {
                    AttackSpe = Math.ceil( AttackSpe - AttackSpe*0.1);
                    DefenseSpe = Math.round(DefenseSpe + DefenseSpe*0.1);
                    if (DefenseSpe > rows3[0].defense_spe) {
                        DefenseSpe = rows3[0].defense_spe;
                    }
                }

                if (Nature === 'Relaxed') {
                    Speed = Math.ceil( Speed - Speed*0.1);
                    Defense = Math.round(Defense + Defense*0.1);
                    if (Defense > rows3[0].defense) {
                        Defense = rows3[0].defense;
                    }
                }

                if (Nature === 'Adamant') {
                    AttackSpe = Math.ceil( AttackSpe - AttackSpe*0.1);
                    Attack = Math.ceil(Attack + Attack*0.1);
                    if (Attack > rows3[0].attack) {
                        Attack = rows3[0].attack;
                    }
                }

                if (Nature === 'Lonely') {
                    Defense = Math.ceil( Defense - Defense*0.1);
                    Attack = Math.ceil(Attack + Attack*0.1);
                    if (Attack > rows3[0].attack) {
                        Attack = rows3[0].attack;
                    }
                }

                if (Nature === 'Timid') {
                    Attack = Math.ceil( Attack - Attack*0.1);
                    Speed = Math.round(Speed + Speed*0.1);
                    if (Speed > rows3[0].speed) {
                        Speed = rows3[0].speed;
                    }
                }

                let rarity;
                if (rows3[0].rarity === 'Ultra Beast') {
                    rarity = 'ultrabeast';
                } else {
                    rarity = rows3[0].rarity;
                }

                let Level = Math.floor(Math.random()*30)+1
                db.query(`INSERT INTO user_pokemon (member_id, pokemon_id, level, nature, hp, attack, attack_spé, déf, déf_spé, speed) VALUES ('${message.author.id}', '${rows2[0].pokemon_id}', '${Level}', '${Nature}', '${HP}', '${Attack}', '${AttackSpe}', '${Defense}', '${DefenseSpe}', '${Speed}')`, (err1) => {
                    let StatLogs = client.channels.cache.find(c => c.id === '716738123106746368');
                    let gen;
                    if (!['alolan', 'galarian'].includes(rarity)) {
                        if (rows2[0].pokemon_id < 152) {
                            gen = 'gen_1';
                        }

                        if (rows2[0].pokemon_id > 151 && rows2[0].pokemon_id < 252) {
                            gen = 'gen_2';
                        }

                        if (rows2[0].pokemon_id > 251 && rows2[0].pokemon_id < 387) {
                            gen = 'gen_3';
                        }

                        if (rows2[0].pokemon_id > 386 && rows2[0].pokemon_id < 494) {
                            gen = 'gen_4';
                        }

                        if (rows2[0].pokemon_id > 493 && rows2[0].pokemon_id < 650) {
                            gen = 'gen_5';
                        }

                        if (rows2[0].pokemon_id > 649 && rows2[0].pokemon_id < 722) {
                            gen = 'gen_6';
                        }

                        if (rows2[0].pokemon_id > 721 && rows2[0].pokemon_id < 810) {
                            gen = 'gen_7';
                        }

                        if (rows2[0].pokemon_id > 809 && rows2[0].pokemon_id < 891) {
                            gen = 'gen_8';
                        }
                    } else {
                        if (rarity === 'alolan') {
                            gen = 'alolan';
                        } else {
                            gen = 'galarian';
                        }
                    }

                    const file = new Discord.MessageAttachment(`./images/${gen}/${rows2[0].pokemon_id}.png`, 'ungameurV2.png');
                    let CatchEmbed = {
                        title: `New pokemon catch !`,
                        description: `${message.author.tag} » Just catch a **${rows2[0].english}** (\`${rows3[0].rarity}\`)`,
                        color: `#635ecd`,
                        thumbnail: {
                            url: 'attachment://ungameurV2.png',
                        },
                    };

                    StatLogs.send({
                        files: [file],
                        embed: CatchEmbed,
                    })
                        .catch(console.error);
                });

                db.query(`SELECT * FROM statistics ORDER BY id DESC`, (err2, rows4) => {
                    db.query(`UPDATE statistics SET caught =  '${rows4[0].caught + 1}' WHERE id = '${rows4[0].id}'`);

                    if (rarity === 'mythical') {
                        db.query(`UPDATE statistics SET mythical = '${rows4[0].mythical + 1}' WHERE id = '${rows4[0].id}'`);
                    }

                    if (rarity === 'galarian') {
                        db.query(`UPDATE statistics SET galarian = '${rows4[0].galarian + 1}' WHERE id = '${rows4[0].id}'`);
                    }

                    if (rarity === 'alolan') {
                        db.query(`UPDATE statistics SET alolan = '${rows4[0].alolan + 1}' WHERE id = '${rows4[0].id}'`);
                    }

                    if (rarity === 'ultrabeast') {
                        db.query(`UPDATE statistics SET ultrabeast = '${rows4[0].ultrabeast + 1}' WHERE id = '${rows4[0].id}'`);
                    }

                    if (rarity === 'legendary') {
                        db.query(`UPDATE statistics SET legendary = '${rows4[0].legendary + 1}' WHERE id = '${rows4[0].id}'`);
                    }

                    db.query(`UPDATE spawns SET status =  'nothing', rarity = null WHERE channel_id = '${message.channel.id}'`);

                    db.query(`SELECT * FROM caught WHERE (member_id, pokemon) = ('${message.author.id}', '${rows2[0].english}')`, (err3, rows5) => {
                        if (rows5.length < 1) {
                            db.query(`INSERT INTO caught (member_id, pokemon) VALUES ('${message.author.id}', '${rows2[0].english}')`);
                        } else {
                            db.query(`UPDATE caught SET counter = '${rows5[0].counter + 1}' WHERE (member_id, pokemon) = ('${message.author.id}', '${rows2[0].english}')`);
                        }
                    });

                    db.query(`SELECT * FROM leaderboard WHERE member_id = '${message.author.id}'`, (err4, rows6) => {
                        if (rows6.length < 1) {
                            db.query(`INSERT INTO leaderboard (member_id) VALUES ('${message.author.id}')`);
                        } else {
                            db.query(`UPDATE leaderboard SET caught_counter = '${rows6[0].caught_counter + 1}' WHERE member_id = '${message.author.id}'`);
                        }
                    });
                });
            });
        });
    });
}