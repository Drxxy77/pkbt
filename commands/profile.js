const moment = require('moment');

exports.run = (client, message, args, lang, db, prefix) => {
    let ErrorEmbed = {
        color: '#eb4d4b',
    }

    // Menu d'aide
    if (args[0] === 'help') {
        let HelpEmbed = {
            title: `${lang.PROFILE_HELP_TITLE}`,
            color: `#7f96ff`,
            thumbnail: {
                url: client.user.displayAvatarURL({
                    format:"png",
                    size:1024,
                    dynamic: true
                }),
            },
            description: `${lang.TOP_HELP_USAGES}
» \`${prefix}profile\` - ${lang.PROFILE_HELP}
» \`${prefix}profile <@User / ID>\` - ${lang.PROFILE_HELP_SPECIFIC}              
            
Alias: \`profil\``};

        return message.channel.send({
            embed: HelpEmbed,
        })
            .catch(console.error);
    }

    db.query(`SELECT * FROM guilds`, async (err1, rows1) => {
        try {
            let target = message.author;
            if (args[0]) {
                target = message.mentions.users.first() || await client.users.fetch(args[0]);
            }

            await db.query(`SELECT * FROM user_pokemon WHERE member_id = '${target.id}'`, (err2, rows2) => {
                db.query(`SELECT * FROM users WHERE userID = '${target.id}'`, (err3, rows3) => {
                    db.query(`SELECT * FROM user_pokemon WHERE (member_id, selected) = ('${target.id}', 'select')`, (err4, rows4) => {
                        if (rows3.length < 1) {
                            ErrorEmbed.description = lang.PROFILE_NO_ACCOUNT;
                            return message.channel.send({
                                embed: ErrorEmbed,
                            })
                                .catch(console.error);
                        }

                        let Pikacord = client.guilds.cache.find(g => g.id === '716688183190093906');
                        let Members = Pikacord.members.cache.find(m => m.id === target.id);
                        let founder = [];
                        let badges = [];
                        let partner = rows2[0].pokemon_id;
                        if (rows4.length > 0) {
                            partner = rows4[0].pokemon_id;
                        }

                        db.query(`SELECT * FROM translation WHERE pokemon_id = '${partner}'`, (err5, rows5) => {
                            if (rows1.find(e => e.guild_id === message.guild.id)['lang'] === 'fr') {
                                partner = `${rows5[0].french} (\`#${rows2[0].pokemon_id}\`)`;
                            } else {
                                partner = `${rows5[0].english} (\`#${rows2[0].pokemon_id}\`)`;
                            }

                            rows1.forEach(element => {
                                if (client.guilds.cache.find(g => g.id === element.guild_id).ownerID === target.id) {
                                    founder.push(element.id);
                                }
                            });

                            if (founder.length > 0) {
                                badges.push('<:PikacordOwner:721101077860319332>');
                            }

                            if (Members) {
                                if (Members.id === '523963826106925094') {

                                }

                                if (Members.roles.cache.find(r => r.id === '721098178488827955')) {
                                    badges.push('<:PikacordPartner:721101073963548703>');
                                }

                                if (Members.roles.cache.find(r => r.id === '718126181471354910')) {
                                    badges.push('<:PikacordBugHunter:721101495558209607>');
                                }

                                if (Members.roles.cache.find(r => r.id === '717402024286617620')) {
                                    badges.push('<:PikacordDonor:721101077348614245>');
                                }

                                if (Members.roles.cache.find(r => r.id === '716725007056764958')) {
                                    badges.push('<:PikacordSupporter:721101073850302575>');
                                }

                                if (Members.roles.cache.find(r => r.id === '717402368936772040')) {
                                    badges.push('<:PikacordPokedex:721102065031577621>');
                                }
                            }

                            let CheckEmbed = {
                                title: `Profile - ${target.tag}`,
                                color: (message.member.roles.highest.hexColor !== '#000000') ? message.member.roles.highest.hexColor :`#8be3ff`,
                                thumbnail: {
                                    url: target.displayAvatarURL({
                                        format: "png",
                                        size: 1024,
                                        dynamic: true,
                                    }),
                                },
                                description: `${(Members || target.id === '523963826106925094') 
                                    ? `${(Members.roles.cache.find(r => r.id === '718201075840057396') || target.id === '523963826106925094')
                                        ? `<:Pikachu:721097226377494688> **Pikacord Corp.**
${(Members.roles.cache.find(r => r.id === '716710783156748320'))
                                            ? `» Admin. Pikacord`
                                            : `${(Members.roles.cache.find(r => r.id === '716724937032728647'))
                                                ? `» Dev. Pikacord`
                                                : `${(Members.roles.cache.find(r => r.id === '717401882607484928')) 
                                                    ? `» Mod. Pikacord` 
                                                    : `» Miss Pikacord`}`}`}\n`
                                        : ``}`
                                    : ``}
${(badges.length > 0)
                                    ? `<:SnapUmbreon:718281051742666803> **Pika'badges**
» ${badges.join(' ')}\n`
                                    : ``}
<:givrali_sleep:718281047057498202> **Informations**
» Création : ${moment.unix(Math.round((rows3[0].createdAt)/1000)).format(`DD/MM/YYYY hh:mm:ss`)}
» Pokémons : ${rows2.length}
» ${lang.PROFILE_PARTNER} : ${partner}`,
                            };

                            message.channel.send({
                                embed: CheckEmbed,
                            })
                                .catch(console.error);
                        });
                    })
                });
            });
        } catch (e) {
            return console.log(e);
        }
    });
}