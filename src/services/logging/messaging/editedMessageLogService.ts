import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import EditedMessageLogRepository from '../../../repositories/Logging/messaging/editedMessage/editedMessageLogRepository';
import EditedMessageLog from '../../../domain/Logging/Messaging/editedMessage/editedMessageLog';

@injectable()
export class EditedMessageLogService {
    constructor(@inject(TYPES.EditedMessageLogRepository) private editedMessageRepo: EditedMessageLogRepository) {}
    /**
     * create
     */
    public create(oldMessage: Message, newMessage: Message): void {
        if (newMessage.editedAt !== null) {
            const log: EditedMessageLog = {
                userName: oldMessage.author.username,
                userId: oldMessage.author.id,
                channelId: oldMessage.channelId,
                channelName: oldMessage.guild.channels.cache.get(oldMessage.channelId).name,
                originalMessage: oldMessage.content,
                updatedMessage: newMessage.content,
                createdDate: oldMessage.createdAt,
                updatedDate: newMessage.editedAt,
            };
            this.editedMessageRepo.CreateLog(log);
        }
    }
}
