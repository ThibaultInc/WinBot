const Discord = require('discord.js'); // import discord.js librabry
const config = require('./config/config'); // import personal config file for the bot
const client = new Discord.Client(); // Init client bot

// Others modules

const functions = require('./functions');
const commands = {
    utils: ["help", "serverinfo", "userinfo", "botinfo", "rank"],
    moderation: ["join", "leave", "create_shop", "add_item", "add_money", "autorole", "role", "channel", "reset_money", "reset_xp", "kick", "ban"],
    economy: ["money", "withdraw", "shop", "buy", "give_money"],
    game: ["account", "profil", "guild_profil", "leaderboard_game"]
};
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const db = low(adapter); // database of the app

db.defaults({
    // admin
    logs: [],
    join: [],
    leave: [],
    autorole: []
}).write();

const figlet = require('figlet');

// On GUILD CREATE

client.on('guildCreate', guild => {
    guild.createChannel(`${client.user.username}-has-join-guild`, 'text').then(channel => {
        let embed = new Discord.RichEmbed()
            .setTitle(`-- Pack de démarrage --`)
            .setDescription(`Salut! Merci de m'avoir invité! Pour vous remercier, je vous offre un petit pack de démarrage qui vous permettra de m'utiliser de la meilleure manière possible. Tout cela se fera en plusieurs catégories. Prêt? C'est partit!`)
            .addField("Quel est mon prefix?", `Alors, pour vous répondre, voici mon prefix : \`${config.prefix}\`.`)
            .addField("En quoi je suis utile?", `Pour répondre honnêtement, je suis un robot créé par des bénévoles. Ainsi, je ne vous demanderai pas d'argent ou quoi que ce soit pour débloquer d'autres modules.`)
            .addField("Comment de serveur(s) je modère?", `Actuellement, je modère ${client.guilds.size} serveur(s) y compris le vôtre!`)
            .addField("Quelles sont mes fonctionnalités?", `Honnêtement, je gère un système de niveaux, un système de logs, un système d'économie, un système de modération et un petit jeux à faire entre serveurs.`)
            .addField("Comment avoir la liste de mes commandes?", `Ceci est très simple, vous n'avez qu'à faire \`${config.prefix}help\``)
            .setThumbnail(client.user.displayAvatarURL)
            .setColor(config.color);
        channel.send(embed); // send message
    });
});

// On bot is start

client.on('ready', () => {
    console.log(`WinBot est prêt à être utilisé.`);
    client.user.setActivity(`Besoin d'aide? Faites ${config.prefix}help.`, { type: "WATCHING" });
});

// On message was sent

client.on('message', message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // conditions
    if (!message.content.startsWith(config.prefix)) return;
    if (message.author.bot || !message.guild) return;
    // help command
    if (command === "help") {
        let embed = new Discord.RichEmbed()
            .setTitle(`-- Liste des commandes --`)
            .setDescription(`Salut à toi! Voici la liste des commandes. Avant tout, permet moi de te préciser qu'avant chaque commande, il est indispensable d'écrire \`${config.prefix}\` pour que je puisse vous comprendre.`)
            .addField("-- Utilitaires --", `\`\`\`${commands.utils.join(', ')}\`\`\``)
            .addField("-- Modération --", `\`\`\`${commands.moderation.join(', ')}\`\`\``)
            .addField("-- Economie --", `\`\`\`${commands.economy.join(', ')}\`\`\``)
            .addField("-- Guerre des serveurs --", `\`\`\`${commands.game.join(', ')}\`\`\``)
            .setThumbnail(client.user.displayAvatarURL)
            .setColor(config.color);
        message.author.send(embed).then(message.reply("Nous vous avons envoyé la liste des commandes en privé."));
    }
    // serverinfo command
    if (command === "serverinfo") {
        let Server = {
            name: message.guild.name,
            id: message.guild.id,
            members: message.guild.memberCount,
            humans: message.guild.members.filter(member => !member.user.bot).size,
            bots: message.guild.members.filter(member => member.user.bot).size,
            onlines: message.guild.members.filter(member => member.presence.status !== "offline").size,
            region: functions.firstLetterUpper(message.guild.region),
            channels: message.guild.channels.filter(channel => channel.type !== "category").size,
            textuals: message.guild.channels.filter(channel => channel.type === "text").size,
            voices: message.guild.channels.filter(channel => channel.type === "voice").size,
            categories: message.guild.channels.filter(channel => channel.type === "category").size,
            roles: message.guild.roles.size-1,
            owner: {
                username: message.guild.owner.user.username,
                tag: message.guild.owner.user.tag,
                id: message.guild.ownerID,
                avatar: message.guild.owner.user.displayAvatarURL
            }
        }
        message.channel.sendCode('', `
            Informations de : ${Server.name}

            Nom : ${Server.name}
            ID : ${Server.id}
            Membre(s) : ${Server.members}
            Humain(s) : ${Server.humans}
            Robot(s) : ${Server.bots}
            Connecté(s) : ${Server.onlines}
            Région : ${Server.region}
            Salon(s) : ${Server.channels}
            Salon(s) textuel(s) : ${Server.textuals}
            Salon(s) vocal(aux) : ${Server.voices}
            Catégorie(s) : ${Server.categories}
            Rôle(s) : ${Server.roles}
            
            Propriétaire du serveur : ${Server.owner.tag}
        `);
    }
});

// login bot

client.login(config.token);