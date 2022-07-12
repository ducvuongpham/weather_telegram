# weather_telegram

This is a project to learn about telegram bots.

This bot can send you current weather information, weather forecast and automatically send weather information on cron.

## Try
You can try this bot at [https://t.me/vuong_weather_bot](https://t.me/vuong_weather_bot)

## Run 

### Config
Get API_KEY from https://www.weatherapi.com/ and https://core.telegram.org/

Make .env file

Edit it like 
```
TELEGRAM_API_KEY="00000000000:AAHHk51ut7vDE4hlQSaaaaaaaaaaaaaaaaa"
WEATHERAPI_KEY="398975ebd67b4200000000000000"
```
```
npm install 
```
### Run
```
npm start
```

## Docker 

You can build docker image from Dockerfile
```
docker build -t weather_telegram .
```

Run docker container
```
docker run -it -d --name weather_telegram --hostname weather_telegram weather_telegram /bin/bash
```

