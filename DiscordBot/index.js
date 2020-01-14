var launch = () => {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const config = require('../Config/config.bot.json');
    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');
    const adapt = new FileSync('database.json');
    const db = low(adapt);
    db.defaults({
        prefix_guild: []
    }).write();
};

module.exports = launch;