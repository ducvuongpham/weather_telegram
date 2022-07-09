const { bot } = require('./botInit');
const schedule = require('./schedule');

const time = {
  message: 'Choose time: ',
  buttons: {
    inline_keyboard: [
      [
        {
          text: '1',
          callback_data: '1',
        },
        {
          text: '2',
          callback_data: '2',
        },
        {
          text: '3',
          callback_data: '3',
        },
        {
          text: '4',
          callback_data: '4',
        },
        {
          text: '5',
          callback_data: '5',
        },
      ],
      [
        {
          text: '6',
          callback_data: '6',
        },
        {
          text: '7',
          callback_data: '7',
        },
        {
          text: '8',
          callback_data: '8',
        },
        {
          text: '9',
          callback_data: '9',
        },
        {
          text: '0',
          callback_data: '0',
        },
      ],
      [
        {
          text: 'Del',
          callback_data: 'Del',
        },
        {
          text: 'City',
          callback_data: 'NULL',
        },
        {
          text: '➤',
          callback_data: 'NextToDay',
        },
      ],
    ],
  },
};

const dayOfWeek = {
  message: 'Repeat on: ',
  buttons: {
    inline_keyboard: [
      [
        {
          text: 'Sun',
          callback_data: '0',
        },
        {
          text: 'Mon',
          callback_data: '1',
        },
        {
          text: 'Tue',
          callback_data: '2',
        },
        {
          text: 'Wed',
          callback_data: '3',
        },
        {
          text: 'Thu',
          callback_data: '4',
        },
        {
          text: 'Fri',
          callback_data: '5',
        },
        {
          text: 'Sat',
          callback_data: '6',
        },
      ],
      [
        {
          text: 'x',
          callback_data: '0',
        },
        {
          text: 'x',
          callback_data: '1',
        },
        {
          text: 'x',
          callback_data: '2',
        },
        {
          text: 'x',
          callback_data: '3',
        },
        {
          text: 'x',
          callback_data: '4',
        },
        {
          text: 'x',
          callback_data: '5',
        },
        {
          text: 'x',
          callback_data: '6',
        },
      ],
      [
        {
          text: '🔙',
          callback_data: 'BackToTime',
        },
        {
          text: 'City',
          callback_data: 'NULL',
        },
        {
          text: 'Time',
          callback_data: 'NULL',
        },
        {
          text: 'Submit',
          callback_data: 'Submit',
        },
      ],
    ],
  },
};

const timeHandler = (callbackQuery) => {
  const [message, data] = [callbackQuery.message, callbackQuery.data];

  let chooseTime = message.text.slice(13, 15) + message.text.slice(16, 18); // Format: HHMM
  let showTime = `${chooseTime.slice(0, 2)}:${chooseTime.slice(2, 4)}`; // Format: HH:MM
  if (!Number.isNaN(Number(data))) {
    chooseTime = chooseTime.substring(1) + data;
    showTime = `${chooseTime.slice(0, 2)}:${chooseTime.slice(2, 4)}`;
    bot.editInlineText(`${time.message + showTime}`, message);
  }
  if (data === 'Del') {
    chooseTime = `0${chooseTime.substring(0, chooseTime.length - 1)}`;
    showTime = `${chooseTime.slice(0, 2)}:${chooseTime.slice(2, 4)}`;
    bot.editInlineText(`${time.message + showTime}`, message);
  }

  if (data === 'NextToDay') {
    const isValid = /^([0-1]?[0-9]|2[0-4])([0-5][0-9])(:[0-5][0-9])?$/.test(
      chooseTime,
    ); // check if time is valid

    if (!isValid) {
      showTime = `${chooseTime.slice(0, 2)}:${chooseTime.slice(2, 4)}`;
      bot.editInlineText(`${time.message + showTime}  !!Time err!!`, message);
    } else {
      const dayOfWeekMenu = { ...dayOfWeek };
      const city = message.reply_markup.inline_keyboard[2][1].text;
      dayOfWeekMenu.buttons.inline_keyboard[2][1].text = city;

      dayOfWeekMenu.buttons.inline_keyboard[2][2].text = showTime;
      bot.switchMenu(dayOfWeekMenu.message, message, dayOfWeekMenu.buttons);
    }
  }
};

const dayHandler = (callbackQuery) => {
  const [message, data] = [callbackQuery.message, callbackQuery.data];

  const chooseTime = message.reply_markup.inline_keyboard[2][2].text;
  const city = message.reply_markup.inline_keyboard[2][1].text;
  if (data === 'BackToTime') {
    bot.switchMenu(time.message + chooseTime, message, time.buttons);
  }

  if (!Number.isNaN(Number(data))) {
    const dayOfWeekButtons = { ...message.reply_markup };
    if (dayOfWeekButtons.inline_keyboard[1][data].text === 'x') {
      dayOfWeekButtons.inline_keyboard[1][data].text = '✔️';
    } else {
      dayOfWeekButtons.inline_keyboard[1][data].text = 'x';
    }
    bot.switchMenu(message.text, message, dayOfWeekButtons);
  }

  if (data === 'Submit') {
    const result = callbackQuery.message.reply_markup;

    const dayOfWeekList = [];
    result.inline_keyboard[1].forEach((element, index) => {
      if (element.text === '✔️') {
        dayOfWeekList.push(index);
      }
    });
    if (dayOfWeekList.length === 0) return null;

    const hours = chooseTime.slice(0, 2);
    const minutes = chooseTime.slice(3, 5);
    const tempTime = new Date(0, 0, 0, hours, minutes);

    const repeatSchedule = new schedule.RepeatSchedule(
      tempTime,
      1,
      schedule.cycleTypeEnum.week,
      dayOfWeekList,
    );
    const returnObject = {};
    returnObject.cron = schedule.repeatScheduleToCron(repeatSchedule);
    returnObject.city = city;

    return returnObject;
  }
  return false;
};

module.exports = { time, timeHandler, dayHandler };
