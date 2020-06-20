exports.run = (client, message, args) => {
    if (!['611198591700303894', '613421977180438672'].includes(message.author.id)) {
        return;
    }

    const commandName = args[0];

    let ErrorEmbed = {
        color: `#fa3434`,
        title: `Error - ${message.author.tag}`,
    };

    const CheckEmbed = {
        color: `#47ff5a`,
        description: ` **${commandName}** has been reload !`,
    };

    if (!args[0]) {
        ErrorEmbed.description = `You have to put a command to reload !`;
        return message.channel.send({
            embed: ErrorEmbed,
        })
            .then((msg) => msg.delete({
                timeout: 10000,
                reason: 'Error - Auto delete'
            }))
            .catch(console.error);
    }

    if (!client.commands.has(commandName)) {
        ErrorEmbed.description = `This doesn't exist !`;
        return message.channel.send({
            embed: ErrorEmbed,
        })
            .then((msg) => msg.delete({
                timeout: 10000,
                reason: 'Error - Auto delete'
            }))
            .catch(console.error);
    }

    delete require.cache[require.resolve(`./${commandName}.js`)];
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);

    // Envoie de la réponse
    return message.channel.send({
        embed: CheckEmbed,
    })
        .then((msg) => msg.delete({
            timeout: 10000,
            reason: 'Error - Auto delete'
        }))
        .catch(console.error);
}