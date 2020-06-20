const chalk = require('chalk');
const moment = require('moment');

module.exports = async (client, db) => {
    console.log(chalk.green(`[CONNECTED] ${client.user.username} is connected to the API`));
    client.user.setActivity("p!help", { type: 'LISTENING' })
        .then(presence => console.log(chalk.yellowBright(`[INFO] Activity set to « ${presence.activities[0].name} »`)))
        .catch(console.error);

    client.channels.cache.find(c => c.id === '718626137890357288').join()
        .then((connected) => {
            if (connected.channel.name !== 'State: Online') {
                connected.channel.setName('State: Online', 'Connected');
            }
        });

    client.guilds.cache.forEach(e => {
        db.query(`SELECT * FROM guilds WHERE guild_id = '${e.id}'`, (err, rows) => {
            if (err) {
                return console.log(chalk.red(`[ERROR] Ready-13 / Read guilds : ${err}`));
            }

            if (rows.length < 1) {
                db.query(`INSERT INTO guilds (guild_id) VALUES ('${e.id}')`, (error) => {
                    if (error) {
                        return console.log(chalk.red(`[ERROR] Ready-19 : ${error}`));
                    }
                });
            }
        });
    });

    client.channels.cache.filter(f => f.type === 'text').forEach(e => {
        db.query(`SELECT * FROM guilds_channels WHERE channel = '${e.id}'`, (err, rows) => {
            if (err) {
                return console.log(chalk.red(`[ERROR] Ready-29 / Read guilds channels: ${err}`));
            }
            if (rows.length < 1) {
                db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${e.id}',"${e.name}",'${e.guild.id}', '${e.position}', "${(e.parent) ? e.parent.name : null}")`, (err) => {
                    if (err) {
                        db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${e.id}','incorrect name','${e.guild.id}', '${e.position}', "${(e.parent) ? e.parent.name : null}")`, (error) => {
                            if (error) {
                                return;
                            }
                        });
                    }
                });
            }
        });
    });

    setInterval(() => {
        db.query(`SELECT * FROM statistics ORDER BY id DESC`, (err, rows) => {
            if (err) {
                return console.log(chalk.red(`[ERROR] Ready-44 / Read statistic : ${err}`));
            }

            if (rows.length < 1) {
                db.query(`INSERT INTO statistics (cooldown) VALUES ('${Date.now()}')`, (error) => {
                    if (error) {
                        return console.log(chalk.red(`[ERROR] Ready-50 / Insert Statistic : ${error}`));
                    }
                });
            } else {
                if (parseInt(rows[0].cooldown) + 1000*60*60*24 <= Date.now()) {
                    let StatsEmbed = {
                        title: `Stats - ${moment.utc(Date.now()).format('LLL')}`,
                        color: `#e056fd`,
                        thumbnail: {
                            url: client.user.displayAvatarURL()
                        },
                        description: `» Pokemon Spawn : ${rows[0].spawns}
» Pokemon Caught : ${rows[0].caught} (**${Math.round(rows[0].caught/rows[0].spawns*10000)/100}%**)
» Legendary Pokemon : ${rows[0].legendary} (**${Math.round(rows[0].legendary/rows[0].caught*10000)/100}%**)
» Mythical Pokemon : ${rows[0].mythical} (**${Math.round(rows[0].mythical/rows[0].caught*10000)/100}%**)
» UltraBeast Pokemon : ${rows[0].ultrabeast} (**${Math.round(rows[0].ultrabeast/rows[0].caught*10000)/100}%**)
» Galarian Pokemon : ${rows[0].galarian} (**${Math.round(rows[0].galarian/rows[0].caught*10000)/100}%**)
» Alolan Pokemon : ${rows[0].alolan} (**${Math.round(rows[0].alolan/rows[0].caught*10000)/100}%**)    
» Default Pokemon :${rows[0].caught-rows[0].mythical-rows[0].legendary-rows[0].ultrabeast-rows[0].galarian-rows[0].alolan} (**${Math.round(((100 - Math.round(rows[0].legendary/rows[0].caught*10000)/100 - Math.round(rows[0].mythical/rows[0].caught*10000)/100 - Math.round(rows[0].ultrabeast/rows[0].caught*10000)/100 - Math.round(rows[0].galarian/rows[0].caught*10000)/100 - Math.round(rows[0].alolan/rows[0].caught*10000)/100))*10000)/10000}%**)`
                    }

                    let Stats = client.channels.cache.find(c => c.id === '717404800102170685');
                    if (Stats) {
                        Stats.send({embed: StatsEmbed});
                    }
                    db.query(`INSERT INTO statistics (cooldown) VALUES ('${Date.now()}')`, (error) => {
                        if (error) {
                            return console.log(chalk.red(`[ERROR] Ready-77 / Insert Statistic : ${error}`));
                        }
                    });

                    db.query(`SELECT * FROM leaderboard ORDER BY caught_counter DESC`, (error, result) => {
                        if (error) {
                            return console.log(chalk.red(`[ERROR] Ready-83 / Read Leaderboard : ${error}`));
                        }

                        if (result.length > 0) {
                            let first = client.users.cache.find(u => u.id === result[0].member_id);
                            let TopEmbed = {
                                title: `Top 10 - ${moment.utc(Date.now()).format('LLL')}`,
                                color: `#e056fd`,
                                thumbnail: {
                                    url: `${(first) ? first.displayAvatarURL({
                                        format: "png",
                                        dynamic: true,
                                        size: 1024,
                                    }) : client.user.displayAvatarURL({
                                        format: "png",
                                        dynamic: true,
                                        size: 1024,
                                    })}`
                                },
                                description: `${result.slice(0,10).map(u => `#${result.findIndex(e => e.id === u.id)+1} ${(client.users.cache.find(user => user.id === u.member_id)) ? `${client.users.cache.find(user => user.id === u.member_id).tag}` : u.member_id} - **${u.caught_counter} pokemons**`).join(`\n`)}`
                            }
                            let Leaderboard = client.channels.cache.find(e => e.id === '717618031932604428');
                            if (Leaderboard) {
                                Leaderboard.send({
                                    embed: TopEmbed,
                                });
                            }
                            db.query(`DELETE FROM leaderboard`, (errored) => {
                                if (errored) {
                                    return console.log(chalk.red(`[ERROR] Ready-102 / Delete in leaderboard : ${errored}`));
                                }
                            });
                        }
                    });
                }
            }
        });
    },1000*30)

    setInterval(() => {
        db.query(`SELECT * FROM guilds_channels`, (error, rows) => {
            if (error) {
                return console.log(chalk.red(`[ERROR] Ready-115 / Read guilds_channels : ${error}`));
            }

            client.channels.cache.filter(e => e.type === 'text').forEach(e => {
                if (!rows.find(element => element.channel === e.id)) {
                    db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${e.id}',"${e.name}",'${e.guild.id}', '${e.position}', "${(e.parent) ? e.parent.name : null}")`, (err) => {
                        if (err) {
                            return db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${e.id}','incorrect name','${e.guild.id}', '${e.position}', "${(e.parent) ? e.parent.name : null}")`, (errored) => {
                                if (errored) {
                                    return;
                                }
                            });
                        }
                    });
                }
            });
        });
    }, 1000*60*60)
}