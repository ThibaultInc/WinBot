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
    // userinfo command
    if (command === "userinfo") {
        let User = {
            username: message.author.username,
            id: message.author.id,
            tag: message.author.tag,
            avatar: message.author.displayAvatarURL,
            roles: message.member.roles.size-1,
            highest_role: {
                name: message.member.highestRole.name.replace("@everyone", "Aucun."),
                id: message.member.highestRole.id,
                color: message.member.highestRole.color
            },
            status: message.author.presence.status.replace("offline", "Hors ligne.").replace("online", "En ligne.").replace("dnd", "Ne pas déranger.").replace("idle", "Inactif."),
            game: message.author.presence.game ? message.author.presence.game.name : "Aucune activité."
        }
        message.channel.sendCode("", `
            A propos de ${User.tag}

            Nom : ${User.tag}
            Nom d'utilisateur : ${User.username}
            ID : ${User.id}
            Rôle(s) : ${User.roles}
            Rôle le plus haut : ${User.highest_role.name}
            Statut : ${User.status}
            Activité en cours : ${User.game}
        `);
    }

    // botinfo command

    if (command === "botinfo") {
        let Bot = {
            username: client.user.username,
            id: client.user.id,
            tag: client.user.tag,
            roles: message.guild.me.roles.size-1,
            highest_role: {
                name: message.guild.me.highestRole.name,
                id: message.guild.me.highestRole.id,
                color: message.guild.me.highestRole.color
            },
            status: message.guild.me.user.presence.status.replace("offline", "Hors ligne.").replace("online", "En ligne.").replace("dnd", "Ne pas déranger.").replace("idle", "Inactif."),
            game: message.guild.me.user.presence.game ? message.guild.me.user.presence.game.name : "Aucune activité."
        };
        message.channel.sendCode("", `
            Informations à propos de moi

            Nom : ${Bot.tag}
            ID : ${Bot.id}
            Rôle(s) : ${Bot.roles}
            Rôle le plus haut : ${Bot.highest_role.name}
            Statut : ${Bot.status}
            Activité en cours : ${Bot.game}
        `);
    }

    // join command

    if (command === "join") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":x: Vous n'avez pas les droits administrateurs :x:"); 
        let channel = message.mentions.channels.first();
        let msg = args.slice(1).join(' ');
        if (db.get('join').find({guild: message.guild.id}).value()) {
            let join_object = db.get('join').filter({guild: message.guild.id}).find('channel').value();
            let join = Object.values(join_object);
            db.get('join').remove({guild: message.guild.id, channel: join[1], message: join[2], date: join[3]}).write();
            message.reply("nous venons de supprimer le module de bienvenue de votre serveur.");
            return;
        }
        if (!channel) return message.channel.send(functions.syntaxError(`${config.prefix}${command}`, `${config.prefix}${command} <#ChannelMention> (Message)\n\nInformations: \n\n{member.user} : mention de l'utilisateur\n{server.name} : Nom du serveur\n{member.tag} : tag du membre\n{server.members} : nombre de membres.`));
        if (!msg) msg = "{member.user} vient de rejoindre **{server.name}**.";
        let date = new Date();
        db.get('join').push({guild: message.guild.id, channel: channel.id, message: msg, date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`}).write();
        message.reply(`nous venons d'activer le module de bienvenue sur votre serveur. Les informations disent que le salon textuel est ${channel}.`);
    }

    // leave command

    if (command === "leave") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":x: Vous n'avez pas les droits administrateurs :x:"); 
        let channel = message.mentions.channels.first();
        let msg = args.slice(1).join(' ');
        if (db.get('leave').find({guild: message.guild.id}).value()) {
            let leave_object = db.get('leave').filter({guild: message.guild.id}).find('channel').value();
            let leave = Object.values(leave_object);
            db.get('leave').remove({guild: message.guild.id, channel: leave[1], message: leave[2], date: leave[3]}).write();
            message.reply(`nous venons de désactiver le module de départ sur votre serveur.`);
            return;
        }
        if (!channel) return message.channel.send(functions.syntaxError("/leave", "/leave <#ChannelMention> (message)\n\nInformations\n\n{member.user} : mention de l'utilisateur\n{server.name} : Nom du serveur\n{member.tag} : tag du membre\n{server.members} : nombre de membres."))
        if (!msg) msg = "**{member.tag}** vient de quitter **{server.name}**.";
    }
    
});

// On Member Join Guild

client.on('guildMemberAdd', member => {
    if (db.get('join').find({guild: member.guild.id}).value()) {
        let join_object = db.get('join').filter({guild: member.guild.id}).find('channel').value();
        let join = Object.values(join_object);
        let channel = member.guild.channels.find('id', join[1]);
        if (!channel) return;
        channel.send(join[2].replace("{member.user}", member.user).replace("{member.tag}", member.user.tag).replace("{server.name}", member.guild.name).replace("{server.members}", member.guild.memberCount));  
    }
});

// login bot

client.login(config.token);