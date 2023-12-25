const { Telegraf } = require('telegraf');
const { setupBot } = require('./Bot');

const botToken = '6672454870:AAH1-OEYPYSwmBVeLJ0pxxe8PVgwG8385BU';
const bot = new Telegraf(botToken);

setupBot(bot);

bot.launch();
