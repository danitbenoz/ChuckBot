const iso6391 = require('iso-639-1');

// Get an array of language objects with 'code' and 'name' properties
const availableLanguages = iso6391.getAllCodes().map(code => {
    return {
      code,
      name: iso6391.getName(code),
    };
  });

const axios = require('axios');
const { Telegraf, Markup } = require('telegraf');
const cheerio = require('cheerio');
const translate = require('translate-google');

const bot = new Telegraf('6672454870:AAH1-OEYPYSwmBVeLJ0pxxe8PVgwG8385BU');

let jokes = [];
const userPreferences = new Map();
// Function to generate language keyboard
function generateLanguageKeyboard() {
  return Markup.keyboard(availableLanguages.map(lang => [lang.name])).resize();
}

// Function to scrape Chuck Norris jokes
async function scrapeJokes() {
  try {
    const response = await axios.get('https://parade.com/968666/parade/chuck-norris-jokes/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    jokes = extractJokes(response.data);
    console.log('Jokes scraped successfully!');
  } catch (error) {
    console.error('Error scraping jokes:', error.message);
  }
}

// Function to extract jokes from HTML
function extractJokes(html) {
  const $ = cheerio.load(html);
  const jokesArray = [];
  $('ol li').each((index, element) => {
    const jokeText = $(element).text().trim();
    jokesArray.push(jokeText);
  });
  console.log('Extracted Jokes:', jokesArray);
  return jokesArray;
}

// Command handler for setting user's preferred language
bot.command('setlanguage', (ctx) => {
  const languageKeyboard = generateLanguageKeyboard();
  ctx.reply('Select your preferred language:', languageKeyboard);
});

// Command handler to handle language selection
bot.hears(availableLanguages.map(lang => new RegExp(lang.name, 'i')), (ctx) => {
    const matchedLanguage = availableLanguages.find(lang => ctx.match[0].toLowerCase().includes(lang.name.toLowerCase()));
    console.log(matchedLanguage.name);
    if (matchedLanguage) {
      const selectedLanguage = matchedLanguage.name;
      const userId = ctx.from.id.toString();
      userPreferences.set(userId, selectedLanguage);
      const reply = translateToUserLanguage("no problem", selectedLanguage)
      .then(reply => {
        ctx.reply(reply);
      })
      .catch(error => {
        console.error('Error translating text:', error.message);
      });
    
    } else {
      ctx.reply('Sorry, I couldn\'t recognize the selected language.');
    }
  });
  

// Command handler for fetching and translating Chuck Norris joke
bot.hears(/^\d{1,3}$/, async (ctx) => {
  const index = parseInt(ctx.message.text);
  console.log('Index:', index);
  console.log('Jokes array length:', jokes.length);

  if (index >= 1 && index <= jokes.length) {
    const joke = jokes[index - 1];
    const userId = ctx.from.id.toString();
    const userLanguage = userPreferences.get(userId) || 'en';
    const translation = await translateToUserLanguage(joke, userLanguage);
    const replyText = translation || 'Translation not available';
    ctx.reply(replyText);
  } else {
    ctx.reply('Please enter a number between 1 and ' + jokes.length);
  }
});

async function translateToUserLanguage(text, targetLanguage) {
    try {
      if (!targetLanguage) {
        throw new Error('A target language is required to perform a translation.');
      }
      console.log('Translating Text:', text);
      const translatedText = await translate(text, { to: targetLanguage });
      console.log('Translated Text:', translatedText);
      return translatedText;
    } catch (error) {
      console.error('Error translating text:', error.message);
      return text; // Return original text on translation error
    }
  }
  
// Start the bot and initiate joke scraping
bot.launch();
scrapeJokes();
