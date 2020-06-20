const chalk = require('chalk');
const moment = require('moment');

module.exports = (client, db, guild) => {
    let JoinEmbed = {
        title: `Thanks you for adding ${client.user.username}`,
        description: `You can now configurate Pikacord from the [dashboard](https://pikacord.com/dashboard)!\n\nPlease note that the images you will see through ${client.user.username} are not ours and we have no rights to them.\n**We have no intention of infringing copyright!**`,
        color: `#e056fd`,
        image: {
            url: 'https://i.discord.fr/jbvq.png'
        }
    }

    let StatLogs = {
        title: `New server - ${guild.name}`,
        description: `Server led by \`${guild.owner.user.tag}\`, there are **${guild.memberCount} members** on it!\nIt was created ${moment(guild.createdAt).fromNow()}!`,
        color: `#61ff41`,
    }

    let Logs = client.channels.cache.find(c => c.id === '716738123106746368');
    Logs.send({
        embed: StatLogs,
    })
        .catch(console.error);

    if (guild.systemChannel) {
        guild.systemChannel.send({
            embed: JoinEmbed,
        });
    }

    db.query(`INSERT INTO guilds (guild_id) VALUES ('${guild.id}')`, (err1) => {
        if (err1) {
            return console.log(chalk.red(`[ERROR] guildCreate-28 / INSERT guilds : ${err1}`));
        }
    });

    guild.channels.cache.filter(e => e.type === 'text').forEach((e) => {
        db.query(`SELECT * FROM guilds_channels WHERE channel = '${e.id}'`, (err2, rows1) => {
            if (err2) {
                return console.log(chalk.red(`[ERROR] guildCreate-35 / READ guilds_channels : ${err2}`));
            }

            if (rows1.length > 0) {
                return;
            }

            db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${e.id}','${e.name}','${guild.id}', '${e.position}', '${(e.parent) ? e.parent.name : null}')`, (err3) => {
                if (err3) {
                    if (e.type !== "category" ) {
                        console.log(`${e.name} in ${(e.parent) ? e.parent.name : 'null'}`);
                    }

                    db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${e.id}','incorrect name','${guild.id}', '${e.position}', '${(e.parent) ? e.parent.name : null}')`, (err4) => {
                        if (err4) {
                            return;
                        }
                    });
                }
            });
        });
    });
}