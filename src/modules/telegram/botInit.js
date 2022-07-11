require('dotenv').config({ path: '.env' });
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });
bot.on('polling_error', (err) => console.log(err));

bot.editInlineText = (text, message) => {
  if (message.text === text) return;
  bot.editMessageText(text, {
    chat_id: message.chat.id,
    message_id: message.message_id,
    reply_markup: message.reply_markup,
  });
};

bot.switchMenu = (text, message, keyboard) => {
  bot.editMessageText(text, {
    chat_id: message.chat.id,
    message_id: message.message_id,
    reply_markup: keyboard,
  });
};

module.exports = { bot };
