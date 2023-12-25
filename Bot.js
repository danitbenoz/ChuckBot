const { generateLanguageKeyboard, handleLanguageSelection, translateToUserLanguage } = require('./language');
const { scrapeJokes } = require('./jokes');
const iso6391 = require('iso-639-1');

async function setupBot(bot) {
    let jokes = await scrapeJokes();
    const userPreferences = new Map();
    const availableLanguages = iso6391.getAllCodes().map(code => ({ code, name: iso6391.getName(code) }));
    bot.command('setlanguage', (ctx) => {
        const languageKeyboard = generateLanguageKeyboard(availableLanguages);
        ctx.reply('Select your preferred language:', languageKeyboard);
    });

    bot.hears(require('iso-639-1').getAllCodes().map(code => new RegExp(require('iso-639-1').getName(code), 'i')), async (ctx) => {
        await handleLanguageSelection(ctx, availableLanguages, userPreferences);
    });

    bot.hears(/^\d{1,3}$/, async (ctx) => {
        const index = parseInt(ctx.message.text);
        console.log('Index:', index);
        console.log('Jokes array length:', jokes.length);

        if (index >= 1 && index <= 101) {
            const joke = jokes[index - 1];
            const userId = ctx.from.id.toString();
            const userLanguage = userPreferences.get(userId) || 'en';
            const translation = await translateToUserLanguage(joke, userLanguage);
            const replyText = translation || 'Translation not available';
            ctx.reply(replyText);
        } else {
            ctx.reply('Please enter a number between 1 and 101');
        }
    });
    // Handle non-numeric input
    bot.on('text', (ctx) => {
        ctx.reply('Please enter a valid number between 1 and 101');
    });
}


module.exports = {
    setupBot,
};
