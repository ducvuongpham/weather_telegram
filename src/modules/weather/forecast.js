require("dotenv").config({ path: require("find-config")(".env") });
var request = require("request");

let list = [];
let get = (city) => {
  return new Promise((resolve, reject) => {
    query =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      process.env.OPENWEATHER_API_KEY;

    exist = list.find(
      (item) => item.city.name.toUpperCase() == city.toUpperCase()
    );
    if (!exist) {
      request(query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res = JSON.parse(body);
          list.push(res);
          resolve(list);
        }
      });
    }
  });
};

module.exports = { list, get };
