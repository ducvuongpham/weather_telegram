const cronstrue = require('cronstrue');
const { bot } = require('./botInit');
const inline = require('./inlineKeyboard');
const forecast = require('../weather');
const cron = require('../cron');
const restore = require('../restore');

const sendInlineKeyboard = (chatId, city) => {
  const timeKeyboard = { ...inline.time };
  timeKeyboard.buttons.inline_keyboard[2][1].text = city;

  const keyboard = {
    reply_markup: timeKeyboard.buttons,
  };
  bot.sendMessage(chatId, `${inline.time.message}00:00`, keyboard);
};

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  // prettier-ignore
  const message = 'This bot can help you to get current weather information, weather forecast and subscribe for auto receive weather information.\n\n /weather [city_name]\n /forecast [city_name]\n /subscribe [city_name]';
  bot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
  });
});

bot.onText(/\/subscribe (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];

  forecast
    .subscribe(city)
    .then(
      async (res) => {
        restore.addsubscribe(chatId, res.location.name, res.location.tz_id);
        sendInlineKeyboard(chatId, res.location.name);
      },
      () => {
        bot.sendMessage(
          chatId,
          'The requested city could not be found! Please check again',
        );
      },
    )
    .catch();
});

bot.onText(/\/weather (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];
  (async () => {
    const message = await forecast.getWeather(city);
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
    });
  })();
});

bot.onText(/\/forecast (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];
  (async () => {
    const message = await forecast.getForecast(city, 24);
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
    });
  })();
});

bot.on('callback_query', (callbackQuery) => {
  const { text } = callbackQuery.message; // Text part in telegram inline keyboard
  let subscribed = {};
  if (text.search('Choose time:') === 0) {
    inline.timeHandler(callbackQuery);
  }
  if (text.search('Repeat on:') === 0) {
    subscribed = inline.dayHandler(callbackQuery);
  }
  if (Object.keys(subscribed).length === 2) {
    bot.deleteMessage(
      callbackQuery.message.chat.id,
      callbackQuery.message.message_id,
    );
    bot.sendMessage(
      callbackQuery.message.chat.id,
      `Subscribed for ${subscribed.city} ${cronstrue.toString(
        subscribed.cron,
      )}`,
    );
    cron.addToCronList(
      callbackQuery.message.chat.id,
      subscribed.cron,
      subscribed.city,
    );
    restore.finishSucribe(callbackQuery.message.chat.id, subscribed.cron);
  }
});
