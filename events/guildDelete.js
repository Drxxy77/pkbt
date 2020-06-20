const chalk = require('chalk');

module.exports = (client, db, guild) => {
    let StatLogs = {
        title: `Old server - ${guild.name}`,
        description: `Server managed by \`${guild.owner.user.tag}\`, there are **${guild.memberCount} members** on it!`,
        color: `#ff5c5c`,
    }

    let Logs = client.channels.cache.find(c => c.id === '716738123106746368');
    if (Logs) {
        Logs.send({embed:StatLogs});
    }

    db.query(`DELETE FROM guilds WHERE guild_id = '${guild.id}'`, (err) => {
        if (err) {
            return console.log(chalk.red(`[ERROR] guildDelete-17 / DELETE guilds : ${err}`));
        }
    });
}