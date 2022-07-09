const { CronJob } = require('cron');
const { bot } = require('../telegram/botInit');
const forecast = require('../weather');

const cronList = [];
const addToCronList = (chatId, cron, city, timezone) => {
  const job = new CronJob(
    cron,
    async () => {
      const message = await forecast.getForecast(city, 3); // get 3 hour forecast
      bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
      });
    },
    null,
    true,
    timezone,
  );
  job.chatId = chatId;
  cronList.push(job);
};

module.exports = { addToCronList };
