import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { Client, Intents } from 'discord.js';
import { Bot } from './util/bot';
import { MessageService } from './services/message/messageService';
import MongoAccess from './repositories/mongoConnect';
import { NewMessageLogService } from './services/logging/messaging/newMessageLogService';
import NewMessageLogRepository from './repositories/Logging/messaging/newMessage/newMessageLogRepository';
import EditedMessageLogRepository from './repositories/Logging/messaging/editedMessage/editedMessageLogRepository';
import { EditedMessageLogService } from './services/logging/messaging/editedMessageLogService';
import DeletedMessageLogRepository from './repositories/Logging/messaging/deletedMessage/deletedMessageLogRepository';
import { DeletedMessageLogService } from './services/logging/messaging/deletedMessageLogService';

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container
    .bind<Client>(TYPES.Client)
    .toConstantValue(new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }));
container.bind<MongoAccess>(TYPES.MongoAccess).to(MongoAccess).inSingletonScope();
//Constants
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<string>(TYPES.MongoConnectionString).toConstantValue(process.env.MONGO_CONNECTION_STRING);
//Services
container.bind<MessageService>(TYPES.MessageService).to(MessageService).inSingletonScope();
container.bind<NewMessageLogService>(TYPES.MessageLogService).to(NewMessageLogService).inSingletonScope();
container.bind<EditedMessageLogService>(TYPES.EditedMessageLogService).to(EditedMessageLogService).inSingletonScope();
container
    .bind<DeletedMessageLogService>(TYPES.DeletedMessageLogService)
    .to(DeletedMessageLogService)
    .inSingletonScope();
// Repos
container.bind<NewMessageLogRepository>(TYPES.NewMessageLogRepository).to(NewMessageLogRepository).inSingletonScope();
container
    .bind<EditedMessageLogRepository>(TYPES.EditedMessageLogRepository)
    .to(EditedMessageLogRepository)
    .inSingletonScope();
container
    .bind<DeletedMessageLogRepository>(TYPES.DeletedMessageLogRepository)
    .to(DeletedMessageLogRepository)
    .inSingletonScope();
export default container;
