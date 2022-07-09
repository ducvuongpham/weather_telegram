require('dotenv').config({ path: '../../.env' });
const request = require('request');
const config = require('../../config.json');

const query = `${config.weatherURL}&key=${process.env.WEATHERAPI_KEY}&alerts=yes`;

const subscribe = (city) =>
  new Promise((resolve, reject) => {
    request(`${query}&q=${city}`, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const res = JSON.parse(body);
        resolve(res);
      } else {
        reject(new Error(query));
      }
    });
  });

const getMainForecast = (forecast) => {
  const mainForecast = `${forecast.time.slice(11, 16).padEnd(7)}\
  ${forecast.condition.text.padEnd(31)}\
  ${forecast.temp_c.toFixed(1).padEnd(4)}°C\
  ${forecast.humidity}%`;

  return mainForecast;
};

const getForecast = async (city, hours) => {
  let returnForecast = `${'Time'.padEnd(7)}\
  ${'Description'.padEnd(31)}\
  ${'Temp'.padEnd(6)}\
  ${'Humidity'}\n`;
  const now = new Date();

  const response = await subscribe(city);
  const forecastList = response.forecast.forecastday[0].hour.concat(
    response.forecast.forecastday[1].hour,
  ); // merge 2 day forecast
  for (let i = 0; i < hours; i += 1) {
    returnForecast += `${getMainForecast(forecastList[now.getHours() + i])}\n`;
  }
  return `<pre>${returnForecast.slice(0, -1)}</pre>`;
};

const getWeather = async (city) => {
  let returnWeather = `${'Updated'.padEnd(7)}\
  ${'Description'.padEnd(31)}\
  ${'Temp'.padEnd(6)}\
  ${'Humidity'}\n`;

  const response = await subscribe(city);
  const weather = response.current;
  weather.time = weather.last_updated;

  returnWeather += `${getMainForecast(weather)}\n`;
  return `<pre>${returnWeather.slice(0, -1)}</pre>`;
};

module.exports = { subscribe, getForecast, getWeather };
