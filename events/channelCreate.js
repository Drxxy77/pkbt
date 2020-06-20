const chalk = require('chalk');

module.exports = (client, db, channel) => {
    if (channel.type !== 'text') {
        return;
    }

    db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${channel.id}',"${channel.name}",'${channel.guild.id}', '${channel.position}', "${(channel.parent) ? channel.parent.name : null}")`, (err) => {
        if (err) {
            return console.log(chalk.red(`[ERROR] channelCreate-10 / INSERT guilds_channels : ${err}`));
        }

        db.query(`INSERT INTO guilds_channels (channel, label, guild, position, categorie_label) VALUES ('${channel.id}', 'incorrect name','${channel.guild.id}', '${channel.position}', "${(channel.parent) ? channel.parent.name : null}")`, (err4) => {
            if (err4) {
                return;
            }
        });
    });
}