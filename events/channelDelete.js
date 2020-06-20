const chalk = require('chalk');
module.exports = (client, db, channel) => {
    if (channel.type !== 'text') {
        return;
    }

    db.query(`DELETE FROM guilds_channels WHERE channel = '${channel.id}'`, (err) => {
        if (err) {
            return console.log(chalk.red(`[ERROR] channelDelte-9 / delete guilds_channels : ${err}`));
        }
    });
}