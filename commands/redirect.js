exports.run = (client, message, args, lang, db, prefix) => {
    // Menu d'aide
    let ErrorEmbed = {
        color: '#eb4d4b',
    }

    if (!message.member.hasPermission('MANAGE_GUILD')) {
        ErrorEmbed.description = lang.REDIRECT_NO_PERM;
        return message.channel.send({
            embed: ErrorEmbed,
        })
            .catch(console.error);
    }

    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.REDIRECT_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: `${client.user.displayAvatarURL({format:"png", size:1024, dynamic: true})}`
            },
            description: `${lang.BOTINFO_HELP_USAGES}
» \`${prefix}redirect #Channel\` - ${lang.REDIRECT_HELP}           
            
Alias: \`-\``};
        return message.channel.send({
            embed: HelpEmbed,
        })
            .catch(console.error);

    }

    let target = message.mentions.channels.first() || client.channels.cache.find(c => c.id === args[0]);
    if (!target) {
        ErrorEmbed.description = lang.REDIRECT_NO_TARGET;
        return message.channel.send({
            embed: ErrorEmbed,
        })
            .catch(console.error);
    }

    db.query(`SELECT * FROM guilds WHERE guild_id = '${message.guild.id}'`, (err, rows) => {
       if (rows.length < 1) {
           return
       }

       let OldChannel = client.channels.cache.find(c => c.id === rows[0].redirect_channel) || 'null';
       let RedirectEmbed = {
           author: {
               text: message.author.tag,
               iconURL: message.author.displayAvatarURL({
                   size: 64,
                   format: "png",
                   dynamic: true,
               }),
           },
           description: `${lang.REDIRECT_SUCCESS_EDIT.replace('{NewChannel}', target).replace('{OldChannel}', OldChannel)}`,
           color: `#635ecd`
       }

       if (OldChannel === 'null') {
           RedirectEmbed.description = `${lang.REDIRECT_SUCCESS_NEW.replace('{NewChannel}', target)}`;
       }

       db.query(`UPDATE guilds SET redirect_channel = '${target.id}' WHERE guild_id = '${message.guild.id}'`);

       // Envoie de la réponse
       message.channel.send({
           embed: RedirectEmbed,
       })
           .catch(console.error);
    });
}