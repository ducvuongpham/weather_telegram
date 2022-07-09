const { writeFile } = require('fs');
const subscribedList = require('../subscribedList.json');
const { addToCronList } = require('../cron');

const addsubscribe = (chatId, city, timezone) => {
  if (!subscribedList[chatId]) {
    subscribedList[chatId] = [];
    subscribedList[chatId][0] = {};
    subscribedList[chatId][0].city = city || 'hanoi';
    subscribedList[chatId][0].timezone = timezone || 'Asia/Ho_Chi_Minh';
  } else {
    const { length } = subscribedList[chatId];
    subscribedList[chatId][length] = {};
    subscribedList[chatId][length].city = city || 'hanoi';
    subscribedList[chatId][length].timezone = timezone || 'Asia/Ho_Chi_Minh';
  }
};

const finishSucribe = (chatId, cron) => {
  const list = subscribedList[chatId];
  const index = list.findIndex((element) => element.cron === undefined);
  list[index].cron = cron;

  writeFile('../subscribedList.json', JSON.stringify(subscribedList), (err) => {
    if (err) throw err;
    console.log('Saved!');
  });
};

(() => {
  Object.keys(subscribedList).forEach((key) => {
    subscribedList[key].forEach((subscribed) => {
      addToCronList(key, subscribed.cron, subscribed.city, subscribed.timezone);
    });
  });
})();

module.exports = { addsubscribe, finishSucribe };
