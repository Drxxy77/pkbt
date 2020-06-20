const { ShardingManager } = require("discord.js");
const chalk = require('chalk');
require('dotenv').config({ encoding: "utf8" });

// const config = require("./configuration/config"); //useless atm

global.BASE_DIR = __dirname;

/**
 * Class instanciations - don't touch this part (COMING SOON)
 */

global.DEPENDENCIES = {};

/**
 * End class instanciation
 */

//Définition du shard manager
const shards = new ShardingManager("./index.js", {
    token: process.env.TOKEN,
    totalShards: "auto"
});

//On lance les shards un par un
shards.on("launch", (shard) => {
    chalk.yellow(console.log(`[INFO] Shard ${shard.id} sarted !`));
});

//On envoie en information que tous les shards ont bien été lancés
shards.spawn()
    .then(() => {
        chalk.yellow(console.log(`[INFO] ${shards.totalShards} shards start totally !`));
    });