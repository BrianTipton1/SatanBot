import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Client, Intents } from 'discord.js';
import { Bot } from './util/bot';
import { MessageService } from './services/message/messageService';
import MongoAccess from './repositories/mongoConnect';
import { MessageLogService } from './services/logging/MessageLogService';
import NewMessageLogRepository from './repositories/Logging/newMessage/newMessageLogRepository';

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container
    .bind<Client>(TYPES.Client)
    .toConstantValue(new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }));
container.bind<MongoAccess>(TYPES.MongoAccess).to(MongoAccess).inSingletonScope();
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<string>(TYPES.MongoConnectionString).toConstantValue(process.env.MONGO_CONNECTION_STRING);
container.bind<MessageService>(TYPES.MessageService).to(MessageService).inSingletonScope();
container.bind<MessageLogService>(TYPES.MessageLogService).to(MessageLogService).inSingletonScope();
container.bind<NewMessageLogRepository>(TYPES.NewMessageLogRepository).to(NewMessageLogRepository).inSingletonScope();
export default container;
