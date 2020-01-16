const Discord = require('discord.js'); // import discord.js librabry
const config = require('./config/config'); // import personal config file for the bot
const client = new Discord.Client(); // Init client bot

// Others modules

const commands = {
    utils: ["help", "serverinfo", "userinfo", "botinfo"],
    moderation: ["join", "leave", "autorole"],
    economy: ["money", "withdraw"],
    game: ["account"]
}
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
        // TODO: Réfléchir pour la mise en page des commandes
        let embed = new Discord.RichEmbed()
            .setTitle(`-- Liste des commandes --`)
            .addField("-- Utilitaires --", `\`\`\`${commands.utils.join(', ')}\`\`\``)
            .addField("-- Modération --", `\`\`\`${commands.moderation.join(', ')}\`\`\``)
            .addField("-- Economie --", `\`\`\`${commands.economy.join(', ')}\`\`\``)
            .addField("-- Guerre des serveurs --", `\`\`\`${commands.game.join(', ')}\`\`\``)
            .setThumbnail(client.user.displayAvatarURL)
            .setColor(config.color);
        message.author.send(embed).then(message.reply("Nous vous avons envoyé la liste des commandes en privé."));
    }
});

// login bot

client.login(config.token);