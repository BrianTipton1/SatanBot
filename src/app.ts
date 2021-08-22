require('dotenv').config(); // Recommended way of loading dotenv
import container from './inversify.config';
import MongoAcesss from './repositories/mongoConnect';
import { TYPES } from './types';
import { Bot } from './util/bot';
const bot = container.get<Bot>(TYPES.Bot);
const mongo = container.get<MongoAcesss>(TYPES.MongoAccess);
mongo.connect();
bot.listen()
    .then(() => {
        console.log('Bot connected!');
    })
    .catch((error) => {
        console.log('Bot connection failure: ', error);
    });
