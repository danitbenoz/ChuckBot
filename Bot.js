const { generateLanguageKeyboard, handleLanguageSelection, translateToUserLanguage } = require('./language');
const { scrapeJokes } = require('./jokes');
const iso6391 = require('iso-639-1');

// Function to set up the bot with commands and listeners
async function setupBot(bot) {
    // Fetch Chuck Norris jokes
    let jokes = await scrapeJokes();

    // Map to store user language preferences
    const userPreferences = new Map();

    // Get an array of language objects with 'code' and 'name' properties
    const availableLanguages = iso6391.getAllCodes().map(code => ({ code, name: iso6391.getName(code) }));

    // Command handler for setting user's preferred language
    bot.command('setlanguage', (ctx) => {
        const languageKeyboard = generateLanguageKeyboard(availableLanguages);
        ctx.reply('Select your preferred language:', languageKeyboard);
    });

    // Command handler to handle language selection
    bot.hears(require('iso-639-1').getAllCodes().map(code => new RegExp(require('iso-639-1').getName(code), 'i')), async (ctx) => {
        await handleLanguageSelection(ctx, availableLanguages, userPreferences);
    });

    // Command handler for fetching and translating Chuck Norris joke
    bot.hears(/^\d{1,3}$/, async (ctx) => {
        const index = parseInt(ctx.message.text);
        console.log('Index:', index);
        console.log('Jokes array length:', jokes.length);
        const userId = ctx.from.id.toString();
        const userLanguage = userPreferences.get(userId) || 'en';

        if (index >= 1 && index <= 101) {
            const joke = jokes[index - 1];
            const translation = await translateToUserLanguage(joke, userLanguage);
            const replyText = translation || 'Translation not available';
            ctx.reply(replyText);
        } else {
            const reply = await translateToUserLanguage('Please enter a number between 1 and 101', userLanguage);
            ctx.reply(reply);
        }
    });

    // Handle non-numeric input
    bot.on('text', async(ctx) => {
        const userId = ctx.from.id.toString();
        const userLanguage = userPreferences.get(userId) || 'en';
        const reply = await translateToUserLanguage('Please enter a number between 1 and 101', userLanguage);
        ctx.reply(reply);
    });
}
module.exports = {
    setupBot,
};
