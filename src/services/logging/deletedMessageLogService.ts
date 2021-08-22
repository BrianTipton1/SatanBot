import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import DeletedMessageLog from '../../domain/Logging/Messaging/deletedMessage/deletedMessageLog';
import DeletedMessageLogRepository from '../../repositories/Logging/deletedMessage/deletedMessageLogRepository';

@injectable()
export class DeletedMessageLogService {
    constructor(@inject(TYPES.DeletedMessageLogRepository) private deletedMessageRepo: DeletedMessageLogRepository) {}
    /**
     * create
     */
    public create(message: Message): void {
        const log: DeletedMessageLog = {
            userName: message.author.username,
            userId: message.author.id,
            channelId: message.channelId,
            channelName: message.guild.channels.cache.get(message.channelId).name,
            createdDate: message.createdAt,
            message: message.content,
        };
        this.deletedMessageRepo.CreateLog(log);
    }
}
