// myLambdaFunction.js

exports.handler = async (event, context) => {
  // Your Lambda function logic goes here
  console.log('Lambda function executed successfully!');

  // Example: Call a function from your bot.js
  bot.setupBot(); // Replace with an actual function from your bot.js

  return {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
};
