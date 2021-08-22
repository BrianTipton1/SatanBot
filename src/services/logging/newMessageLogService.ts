import { Message } from 'discord.js';
import NewMessageLog from '../../domain/Logging/Messaging/newMessage/newMessageLog';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import NewMessageLogRepository from '../../repositories/Logging/newMessage/newMessageLogRepository';

@injectable()
export class NewMessageLogService {
    constructor(@inject(TYPES.NewMessageLogRepository) private newMessageRepo: NewMessageLogRepository) {}
    /**
     * create
     */
    public create(message: Message): void {
        const log: NewMessageLog = {
            userName: message.author.username,
            userId: message.author.id,
            channelId: message.channelId,
            channelName: message.guild.channels.cache.get(message.channelId).name,
            message: message.content,
            date: message.createdAt,
        };
        this.newMessageRepo.CreateLog(log);
    }
}
