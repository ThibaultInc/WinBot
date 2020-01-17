const { RichEmbed } = require('discord.js');

/**
 * Mettre la première lettre d'une chaîne de caractère en majuscule
 * 
 * @param {String} str 
 */
var firstLetterUpper = (str) => {
    let firstLetter = str.split("")[0]; // fetch first letter
    return str.replace(firstLetter, firstLetter.toUpperCase()); // return the good result
}

var syntaxError = (command, syntax) => {
    let embedSyntax = new RichEmbed()
        .setTitle("-- Erreur syntaxe --")
        .addField("Commande", command)
        .addField("Bonne syntaxe", syntax)
        .setColor("#ff0000");
    return embedSyntax;
};

module.exports = {
    firstLetterUpper: firstLetterUpper,
    syntaxError: syntaxError
}