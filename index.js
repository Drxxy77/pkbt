const Discord = require("discord.js");
const chalk = require('chalk');
const mysql = require('mysql');
const fs = require("fs");
const { config } = require('dotenv');

config({
    path: __dirname + "/.env"
})

const db = mysql.createConnection({
    host: "sql202.epizy.com",
    user: "epiz_26061403",
    password: "readyreem2004",
    database: "epiz_26061403_pokedb"
});

db.connect(err => {
    if (err) {
        console.log(chalk.red("[ERROR] Impossible to connect to the database. Reason: ", err));
    }
    console.log(chalk.green("[CONNECTED] Successful database connection"));
});


const client = new Discord.Client()
client.login(process.env.TOKEN);

client.on('shardDisconnect', () => {
    console.log(chalk.red(`[DISCONNECTED] ${client.user.username} is disconnected from the API`));
});

client.on('warn', function(message) {
    console.log(chalk.yellow(`[WARN] `, message));
});

client.on('error', function(err) {
    console.log(chalk.red(`[ERROR] `, err));
});

fs.readdir("./events/", (error, f) => {
    if(error) console.log(error);
    f.forEach((f) => {
        const events = require(`./events/${f}`);
        const event = f.split(".")[0];
        console.log(chalk.yellow(`[WARN] Loading the event: ${event}`));
        client.on(event, events.bind(null, client, db));
    });
});

client.commands = new Map();
fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(chalk.yellow(`[WARN] Loading the command: ${commandName}`));
        client.commands.set(commandName, props);
    });
});
