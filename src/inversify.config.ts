import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Client, Intents } from 'discord.js';
import { Bot } from './util/bot';
import { MessageService } from './services/message/messageService';
import { PingFinder } from './services/ping-finder';
import MongoAccess from './repositories/mongoConnect';
import { MessageAuditService } from './services/logging/MessageAuditService';
import MessageAuditRepository from './repositories/messageLog/MessageAuditRepository';

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container
    .bind<Client>(TYPES.Client)
    .toConstantValue(new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }));
container.bind<MongoAccess>(TYPES.MongoAccess).to(MongoAccess).inSingletonScope();
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<string>(TYPES.MongoConnectionString).toConstantValue(process.env.MONGO_CONNECTION_STRING);
container.bind<MessageService>(TYPES.MessageService).to(MessageService).inSingletonScope();
container.bind<MessageAuditService>(TYPES.MessageAuditService).to(MessageAuditService).inSingletonScope();
container.bind<MessageAuditRepository>(TYPES.MessageAuditRepository).to(MessageAuditRepository).inSingletonScope();
export default container;
