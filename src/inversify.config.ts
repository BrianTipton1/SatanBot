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
import VoiceTimeRepository from './repositories/Logging/Channels/time/voiceTimeRepository';
import VoiceStatusRepository from './repositories/Logging/Channels/status/voiceStatusRepository';
import { VoiceStatusService } from './services/logging/Channels/voiceStatusService';
import { VoiceTimeService } from './services/logging/Channels/voiceTimeService';
import { ChannelService } from './services/channel/channelService';
import MemberStatusRepository from './repositories/Logging/member/memberStatusRepository';
import { MemberService } from './services/member/memberService';
import { TierListService } from './services/tierlist/tierlistService';
import TierListRepository from './repositories/tierlist/tierListRepository';
import { CommandService } from './services/command/commandService';
import { AsciiService } from './services/ascii/asciiService';
import AsciiRepository from './repositories/Ascii/asciiRepository';
import MusicRepository from './repositories/Music/musicRepository';
import { MusicService } from './services/music/MusicService';
import { RollService } from './services/roll/rollService';

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(
    new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_MEMBERS,
        ],
    }),
);
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
container.bind<VoiceStatusService>(TYPES.VoiceStatusService).to(VoiceStatusService).inSingletonScope();
container.bind<VoiceTimeService>(TYPES.VoiceTimeService).to(VoiceTimeService).inSingletonScope();
container.bind<ChannelService>(TYPES.ChannelService).to(ChannelService).inSingletonScope();
container.bind<MemberService>(TYPES.MemberService).to(MemberService).inSingletonScope();
container.bind<TierListService>(TYPES.TierListService).to(TierListService).inSingletonScope();
container.bind<CommandService>(TYPES.CommandService).to(CommandService).inSingletonScope();
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
container.bind<VoiceTimeRepository>(TYPES.VoiceTimeRepository).to(VoiceTimeRepository).inSingletonScope();
container.bind<VoiceStatusRepository>(TYPES.VoiceStatusRepository).to(VoiceStatusRepository).inSingletonScope();
container.bind<MemberStatusRepository>(TYPES.MemberStatusRepository).to(MemberStatusRepository).inSingletonScope();
container.bind<TierListRepository>(TYPES.TierListRepository).to(TierListRepository).inSingletonScope();
container.bind<AsciiService>(TYPES.AsciiService).to(AsciiService).inSingletonScope();
container.bind<AsciiRepository>(TYPES.AsciiRepository).to(AsciiRepository).inSingletonScope();
container.bind<MusicRepository>(TYPES.MusicRepository).to(MusicRepository).inSingletonScope();
container.bind<MusicService>(TYPES.MusicService).to(MusicService).inSingletonScope();
container.bind<RollService>(TYPES.RollService).to(RollService).inSingletonScope();
export default container;
