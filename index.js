
const { Telegraf } = require('telegraf');
const { setupBot } = require('./Bot');
const botToken = '6672454870:AAH1-OEYPYSwmBVeLJ0pxxe8PVgwG8385BU'; // Use environment variable for security
const bot = new Telegraf(botToken);

// Set up the bot with commands and listeners
setupBot(bot);

exports.handler = async (event, context) => {
  try {
    console.log('Received event:', event);

    if (!event.body) {
      console.error('No body found in the event');
      return { statusCode: 400, body: 'Bad Request: No body found' };
    }

    let update;
    try {
      update = JSON.parse(event.body);
	  console.log('Parsed update:', update);

    } catch (error) {
      console.error('Error parsing event body:', error);
      return { statusCode: 400, body: 'Bad Request: Invalid JSON' };
    }

    await bot.handleUpdate(update);
    return { statusCode: 200, body: '' };
  } catch (error) {
    console.error('Error in Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message
      }),
    };
  }
};
