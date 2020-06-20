const Discord = require('discord.js');

exports.run = (client, message, args, lang, db, prefix) => {
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.START_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format: "png",
                    size: 1024,
                    dynamic: true
                }),
            },
            description: `${lang.BOTINFO_HELP_USAGES}
» \`${prefix}start\` - ${lang.START_HELP}           
            
Alias: \`-\``};
        return message.channel.send({
            embed: HelpEmbed
        })
            .catch(console.error);
    }

    let ErrorEmbed = {
        color: '#eb4d4b',
    };

    db.query(`SELECT * FROM users WHERE userID = '${message.author.id}'`, (err, rows) => {
        if (rows.length > 0) {
            ErrorEmbed.description = lang.START_ALREADY;
            return message.channel.send({
                embed: ErrorEmbed,
            })
                .catch(console.error);
        }

        let PickEmbed = {
            title: `${lang.START_PICK_TITLE}`,
            description: `${lang.START_PICK_DESC}

__Generation__ :
» 1 - [Bulbasaur](https://i.discord.fr/WAVh.png) / [Charmander](https://i.discord.fr/7ydo.png) / [Squirtle](https://i.discord.fr/bQSd.png)
» 2 - [Chikorita](https://i.discord.fr/gZb4.png) / [Cyndaquil](https://i.discord.fr/HCOw.png) / [Totodile](https://i.discord.fr/ntv6.png)
» 3 - [Treecko](https://i.discord.fr/xvjP.png) / [Torchic](https://i.discord.fr/oLGs.png) / [Mudkip](https://i.discord.fr/gZb4.png)
» 4 - [Turtwig](https://i.discord.fr/aBoj.png) / [Chimchar](https://i.discord.fr/Mbqs.png) / [Piplup](https://i.discord.fr/xpEH.png)
» 5 - [Snivy](https://i.discord.fr/NZeq.png) / [Tepig](https://i.discord.fr/9AGY.png) / [Oshawott](https://i.discord.fr/IA3O.png)
» 6 - [Chespin](https://i.discord.fr/ghtG.png) / [Fennekin](https://i.discord.fr/5h1Y.png) / [Froakie](https://i.discord.fr/KdrS.png)
» 7 - [Rowlet](https://i.discord.fr/1Tu6.png) / [Litten](https://i.discord.fr/5FI2.png) / [Popplio](https://i.discord.fr/W3OR.png)
» 8 - [Grookey](https://i.discord.fr/QJsi.png) / [Scorbunny](https://i.discord.fr/gAsh.png) / [Sobble](https://i.discord.fr/OjRb.png)`,
            color: `#5162c4`,
            image: {
                url: 'https://i.discord.fr/cVtc.jpg'
            },
            footer: {
                text: lang.START_PICH_FOOTER,
            },
        };

        message.channel.send({embed: PickEmbed}).then((msg) => {
            message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 600000
            }).then((collected) => {
                let starter = collected.first().content.charAt(0).toUpperCase() + collected.first().content.substring(1).toLowerCase();
                if (!['Bulbasaur', 'Charmander', 'Squirtle', 'Chikorita', 'Cyndaquil', 'Totodile', 'Treecko','Torchic', 'Mudkip', 'Turtwig', 'Chimchar','Piplup', 'Snivy', 'Tepig', 'Oshawott', 'Chespin', 'Fennekin', 'Froakie', 'Rowlet', 'Litten', 'Popplio', 'Grookey', 'Scorbunny', 'Sobble'].includes(starter)) {
                    ErrorEmbed.description = lang.START_NOT_STARTER;
                    if (collected.first().deletable) {
                        collected.first().delete()
                            .catch(console.error);
                    }

                    return message.channel.send({
                        embed: ErrorEmbed
                    })
                        .catch(console.error);
                }

                let img;
                let PokemonID;
                if (starter === 'Bulbasaur') {
                    img = 'WAVh';
                    PokemonID = 1;
                }

                if (starter === 'Charmander') {
                    img = '7ydo';
                    PokemonID = 4;
                }

                if (starter === 'Squirtle') {
                    img = 'bQSd';
                    PokemonID = 7;
                }

                if (starter === 'Chikorita') {
                    img = 'gZb4';
                    PokemonID = 152;
                }

                if (starter === 'Cyndaquil') {
                    img = 'HCOw';
                    PokemonID = 155;
                }

                if (starter === 'Totodile') {
                    img = 'ntv6';
                    PokemonID = 158;
                }

                if (starter === 'Treecko') {
                    img = 'xvjP';
                    PokemonID = 252;
                }

                if (starter === 'Torchic') {
                    img = 'oLGs';
                    PokemonID = 255;
                }

                if (starter === 'Mudkip') {
                    img = 'gZb4';
                    PokemonID = 258;
                }

                if (starter === 'Turtwig') {
                    img = 'aBoj';
                    PokemonID = 387;
                }

                if (starter === 'Chimchar') {
                    img = 'Mbqs';
                    PokemonID = 390;
                }

                if (starter === 'Piplup') {
                    img = 'xpEH';
                    PokemonID = 393;
                }

                if (starter === 'Snivy') {
                    img = 'NZeq';
                    PokemonID = 495;
                }

                if (starter === 'Tepig') {
                    img = '9AGY';
                    PokemonID = 498;
                }

                if (starter === 'Oshawott') {
                    img = 'IA3O';
                    PokemonID = 501;
                }

                if (starter === 'Chespin') {
                    img = 'ghtG';
                    PokemonID = 650;
                }

                if (starter === 'Fennekin') {
                    img = '5h1Y';
                    PokemonID = 653;
                }

                if (starter === 'Froakie') {
                    img = 'KdrS';
                    PokemonID = 656;
                }

                if (starter === 'Rowlet') {
                    img = '1Tu6';
                    PokemonID = 722;
                }

                if (starter === 'Litten') {
                    img = '5FI2';
                    PokemonID = 725;
                }

                if (starter === 'Popplio') {
                    img = 'W3OR';
                    PokemonID = 728;
                }

                if (starter === 'Grookey') {
                    img = 'QJsi';
                    PokemonID = 810;
                }

                if (starter === 'Scorbunny') {
                    img = 'gAsh';
                    PokemonID = 813;
                }

                if (starter === 'Sobble') {
                    img = 'OjRb';
                    PokemonID = 816;
                }

                let EditStarter = {
                    description: `${lang.START_PICKED.replace('{Pokemon}', collected.first().content)}`,
                    color: `#5162c4`,
                    image: {
                        url: `https://i.discord.fr/${img}.png`
                    }
                }

                db.query(`SELECT * FROM default_pokemon WHERE pokemon_id = '${PokemonID}'`, (error, result) => {
                    let Attack = Math.round(Math.random() * result[0].attack);
                    let AttackSpe = Math.round(Math.random() * result[0].attack_spé);
                    let Defense = Math.round(Math.random() * result[0].defense);
                    let DefenseSpe = Math.round(Math.random() * result[0].defense_spe);
                    let Speed = Math.round(Math.random() * result[0].speed);
                    let HP = Math.round(Math.random() * result[0].hp);

                    let Natures = ['Bold', 'Quirky', 'Brave', 'Calm', 'Quiet', 'Docile', 'Mild', 'Rash', 'Gentle', 'Hardy', 'Jolly', 'Lax', 'Impish', 'Sassy', 'Naughty', 'Modest', 'Naive', 'Hasty', 'Careful', 'Bashful', 'Relaxed', 'Adamant', 'Serious', 'Lonely', 'Timid'];
                    let NatureChose = Math.floor(Math.random() * Natures.length);
                    let Nature = Natures[NatureChose];

                    if (Nature === 'Bold') {
                        Attack = Math.ceil(Attack - Attack * 0.1);
                        Defense = Math.ceil(Defense + Defense * 0.1);
                        if (Defense > result[0].defense) {
                            Defense = result[0].defense;
                        }
                    }

                    if (Nature === 'Brave') {
                        Speed = Math.ceil(Speed - Speed * 0.1);
                        Attack = Math.ceil(Attack + Attack * 0.1);
                        if (Attack > result[0].attack) {
                            Attack = result[0].attack;
                        }
                    }

                    if (Nature === 'Calm') {
                        Attack = Math.ceil(Attack - Attack * 0.1);
                        DefenseSpe = Math.round(DefenseSpe + DefenseSpe * 0.1);
                        if (DefenseSpe > result[0].defense_spe) {
                            DefenseSpe = result[0].defense_spe;
                        }
                    }

                    if (Nature === 'Quiet') {
                        Speed = Math.ceil(Speed - Speed * 0.1);
                        AttackSpe = Math.round(AttackSpe + AttackSpe * 0.1);
                        if (AttackSpe > result[0].attack_spé) {
                            AttackSpe = result[0].attack_spé;
                        }
                    }

                    if (Nature === 'Mild') {
                        Defense = Math.ceil(Defense - Defense * 0.1);
                        AttackSpe = Math.round(AttackSpe + AttackSpe * 0.1);
                        if (AttackSpe > result[0].attack_spé) {
                            AttackSpe = result[0].attack_spé;
                        }
                    }

                    if (Nature === 'Rash') {
                        DefenseSpe = Math.ceil(DefenseSpe - DefenseSpe * 0.1);
                        AttackSpe = Math.round(AttackSpe + AttackSpe * 0.1);
                        if (AttackSpe > result[0].attack_spé) {
                            AttackSpe = result[0].attack_spé;
                        }
                    }

                    if (Nature === 'Gentle') {
                        Defense = Math.ceil(Defense - Defense * 0.1);
                        DefenseSpe = Math.round(DefenseSpe + DefenseSpe * 0.1);
                        if (DefenseSpe > result[0].defense_spe) {
                            DefenseSpe = result[0].defense_spe;
                        }
                    }

                    if (Nature === 'Jolly') {
                        AttackSpe = Math.ceil(AttackSpe - AttackSpe * 0.1);
                        Speed = Math.round(Speed + Speed * 0.1);
                        if (Speed > result[0].speed) {
                            Speed = result[0].speed;
                        }
                    }

                    if (Nature === 'Lax') {
                        DefenseSpe = Math.ceil(DefenseSpe - DefenseSpe * 0.1);
                        Defense = Math.round(Defense + Defense * 0.1);
                        if (Defense > result[0].defense) {
                            Defense = result[0].defense;
                        }
                    }

                    if (Nature === 'Impish') {
                        AttackSpe = Math.ceil(AttackSpe - AttackSpe * 0.1);
                        Defense = Math.round(Defense + Defense * 0.1);
                        if (Defense > result[0].defense) {
                            Defense = result[0].defense;
                        }
                    }

                    if (Nature === 'Sassy') {
                        Speed = Math.ceil(Speed - Speed * 0.1);
                        DefenseSpe = Math.round(DefenseSpe + DefenseSpe * 0.1);
                        if (DefenseSpe > result[0].defense_spe) {
                            DefenseSpe = result[0].defense_spe;
                        }
                    }

                    if (Nature === 'Naughty') {
                        DefenseSpe = Math.ceil(DefenseSpe - DefenseSpe * 0.1);
                        Attack = Math.ceil(Attack + Attack * 0.1);
                        if (Attack > result[0].attack) {
                            Attack = result[0].attack;
                        }
                    }

                    if (Nature === 'Modest') {
                        Attack = Math.ceil(Attack - Attack * 0.1);
                        AttackSpe = Math.round(AttackSpe + AttackSpe * 0.1);
                        if (AttackSpe > result[0].attack_spé) {
                            AttackSpe = result[0].attack_spé;
                        }
                    }

                    if (Nature === 'Naive') {
                        DefenseSpe = Math.ceil(DefenseSpe - DefenseSpe * 0.1);
                        Speed = Math.round(Speed + Speed * 0.1);
                        if (Speed > result[0].speed) {
                            Speed = result[0].speed;
                        }
                    }

                    if (Nature === 'Hasty') {
                        Defense = Math.ceil(Defense - Defense * 0.1);
                        Speed = Math.round(Speed + Speed * 0.1);
                        if (Speed > result[0].speed) {
                            Speed = result[0].speed;
                        }
                    }

                    if (Nature === 'Careful') {
                        AttackSpe = Math.ceil(AttackSpe - AttackSpe * 0.1);
                        DefenseSpe = Math.round(DefenseSpe + DefenseSpe * 0.1);
                        if (DefenseSpe > result[0].defense_spe) {
                            DefenseSpe = result[0].defense_spe;
                        }
                    }

                    if (Nature === 'Relaxed') {
                        Speed = Math.ceil(Speed - Speed * 0.1);
                        Defense = Math.round(Defense + Defense * 0.1);
                        if (Defense > result[0].defense) {
                            Defense = result[0].defense;
                        }
                    }

                    if (Nature === 'Adamant') {
                        AttackSpe = Math.ceil(AttackSpe - AttackSpe * 0.1);
                        Attack = Math.ceil(Attack + Attack * 0.1);
                        if (Attack > result[0].attack) {
                            Attack = result[0].attack;
                        }
                    }

                    if (Nature === 'Lonely') {
                        Defense = Math.ceil(Defense - Defense * 0.1);
                        Attack = Math.ceil(Attack + Attack * 0.1);
                        if (Attack > result[0].attack) {
                            Attack = result[0].attack;
                        }
                    }

                    if (Nature === 'Timid') {
                        Attack = Math.ceil(Attack - Attack * 0.1);
                        Speed = Math.round(Speed + Speed * 0.1);
                        if (Speed > result[0].speed) {
                            Speed = result[0].speed;
                        }
                    }

                    db.query(`INSERT INTO user_pokemon (member_id, pokemon_id, level, nature, hp, attack, attack_spé, déf, déf_spé, speed) VALUES ('${message.author.id}', '${PokemonID}', '0', '${Nature}', '${HP}', '${Attack}', '${AttackSpe}', '${Defense}', '${DefenseSpe}', '${Speed}')`);
                    let StatLogs = client.channels.cache.find(c => c.id === '716738123106746368');

                    let gen;
                    if (PokemonID < 152) {
                        gen = 'gen_1';
                    }

                    if (PokemonID > 151 && PokemonID < 252) {
                        gen = 'gen_2';
                    }

                    if (PokemonID > 251 && PokemonID < 387) {
                        gen = 'gen_3';
                    }

                    if (PokemonID > 386 && PokemonID < 494) {
                        gen = 'gen_4';
                    }

                    if (PokemonID > 493 && PokemonID < 650) {
                        gen = 'gen_5';
                    }

                    if (PokemonID > 649 && PokemonID < 722) {
                        gen = 'gen_6';
                    }

                    if (PokemonID > 721 && PokemonID < 810) {
                        gen = 'gen_7';
                    }

                    if (PokemonID > 809 && PokemonID < 891) {
                        gen = 'gen_8';
                    }

                    const file = new Discord.MessageAttachment(`./images/${gen}/${PokemonID}.png`, 'ungameurV2.png');

                    let CatchEmbed = {
                        title: `New trainer !`,
                        description: `${message.author.tag} » Just start a the adventure with **${collected.first().content}** !`,
                        color: `#da9aff`,
                        thumbnail: {
                            url: 'attachment://ungameurV2.png',
                        }
                    }

                    db.query(`INSERT INTO users (userID) VALUES ('${message.author.id}')`, () => {
                        db.query(`UPDATE users SET username = "${message.author.username}" WHERE userID = '${message.author.id}'`, (errorLoL) => {
                            if (errorLoL) {
                                return
                            }
                        });
                    });

                    msg.edit({
                        embed: EditStarter,
                    })
                        .catch(console.error);

                    StatLogs.send({
                        files: [file],
                        embed: CatchEmbed,
                    })
                        .catch(console.error);
                });
            });
        });
    });
}