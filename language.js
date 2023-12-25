const { Markup } = require('telegraf');
const translate = require('translate-google');

// Function to generate language keyboard
function generateLanguageKeyboard(languages) {
    return Markup.keyboard(languages.map(lang => [lang.name])).resize();
}

// Function to handle user's language selection
async function handleLanguageSelection(ctx, availableLanguages, userPreferences) {
    // Find the matched language based on user input
    const matchedLanguage = availableLanguages.find(lang => ctx.match[0].toLowerCase().includes(lang.name.toLowerCase()));

    if (matchedLanguage) {
        // If language is recognized, set it as user's preferred language
        const selectedLanguage = matchedLanguage.name;
        const userId = ctx.from.id.toString();
        userPreferences.set(userId, selectedLanguage);

        // Translate a sample text to the selected language and reply
        const reply = await translateToUserLanguage('no problem', selectedLanguage);
        ctx.reply(reply);
    } else {
        // If language is not recognized, provide an error message
        ctx.reply('Sorry, I couldn\'t recognize the selected language.');
    }
}

// Function to translate text to the user's preferred language
async function translateToUserLanguage(text, targetLanguage) {
    try {
        if (!targetLanguage) {
            throw new Error('A target language is required to perform a translation.');
        }
        // Perform the translation using the translate-google library
        const translatedText = await translate(text, { to: targetLanguage });
        return translatedText;
    } catch (error) {
        // Handle errors during translation and return the error message
        console.error('Error translating text:', error.message);
        return error.message;
    }
}

module.exports = {
    generateLanguageKeyboard,
    handleLanguageSelection,
    translateToUserLanguage,
};
