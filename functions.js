/**
 * Mettre la première lettre d'une chaîne de caractère en majuscule
 * 
 * @param {String} str 
 */
var firstLetterUpper = (str) => {
    let firstLetter = str.split("")[0]; // fetch first letter
    return str.replace(firstLetter, firstLetter.toUpperCase()); // return the good result
}

module.exports = {
    firstLetterUpper: firstLetterUpper
}