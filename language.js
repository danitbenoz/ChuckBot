const { Markup } = require('telegraf');
const translate = require('translate-google');

function generateLanguageKeyboard(languages) {
    return Markup.keyboard(languages.map(lang => [lang.name])).resize();
}

async function handleLanguageSelection(ctx, availableLanguages, userPreferences) {
    const matchedLanguage = availableLanguages.find(lang => ctx.match[0].toLowerCase().includes(lang.name.toLowerCase()));

    if (matchedLanguage) {
        const selectedLanguage = matchedLanguage.name;
        const userId = ctx.from.id.toString();
        userPreferences.set(userId, selectedLanguage);
        const reply = await translateToUserLanguage('no problem', selectedLanguage);
        ctx.reply(reply);
    } else {
        ctx.reply('Sorry, I couldn\'t recognize the selected language.');
    }
}

async function translateToUserLanguage(text, targetLanguage) {
    try {
        if (!targetLanguage) {
            throw new Error('A target language is required to perform a translation.');
        }
        const translatedText = await translate(text, { to: targetLanguage });
        return translatedText;
    } catch (error) {
        console.error('Error translating text:', error.message);
        return error.message;
    }
}

module.exports = {
    generateLanguageKeyboard,
    handleLanguageSelection,
    translateToUserLanguage,
};
