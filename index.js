const { Telegraf } = require('telegraf');
const { setupBot } = require('./Bot');

const botToken = '6672454870:AAH1-OEYPYSwmBVeLJ0pxxe8PVgwG8385BU';
// Create a new instance of Telegraf using the bot token
const bot = new Telegraf(botToken);

// Set up the bot by calling the setupBot function
setupBot(bot);

// Launch the bot
bot.launch();