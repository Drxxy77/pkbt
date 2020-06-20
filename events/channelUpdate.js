const chalk = require('chalk');

module.exports = (client, db, oldChannel, newChannel) => {
    if (oldChannel.type !== 'text') {
        return;
    }

    if (oldChannel.name !== newChannel.name) {
        db.query(`UPDATE guilds_channels SET label = "${newChannel.name}" WHERE channel = '${oldChannel.id}'`, (err) => {
            if (err) {
                return db.query(`UPDATE guilds_channels SET label = 'incorrect name' WHERE channel = '${oldChannel.id}'`);
            }
        });
    }

    if (oldChannel.position !== newChannel.position) {
        db.query(`UPDATE guilds_channels SET position = '${newChannel.position}' WHERE channel = '${oldChannel.id}'`, (err) => {
            if (err) {
                return console.log(chalk.red(`[ERROR] channelUpdate-19 / UPDATE position : ${err}`));
            }
        });
    }

    if (!oldChannel.parent && newChannel.parent) {
        db.query(`UPDATE guilds_channels SET categorie_label = "${newChannel.parent.name}" WHERE channel = '${oldChannel.id}'`, (err) => {
            if (err) {
                return db.query(`UPDATE guilds_channels SET categorie_label = 'incorrect name (category)' WHERE channel = '${oldChannel.id}'`);
            }
        });
    }

    if (oldChannel.parent && newChannel.parent) {
        db.query(`UPDATE guilds_channels SET categorie_label = "${newChannel.parent.name}" WHERE channel = '${oldChannel.id}'`, (err) => {
            if (err) {
                return db.query(`UPDATE guilds_channels SET categorie_label = 'incorrect name (category)' WHERE channel = '${oldChannel.id}'`);
            }
        });
    }
}