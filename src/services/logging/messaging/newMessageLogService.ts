import { Message } from 'discord.js';
import NewMessageLog from '../../../domain/Logging/Messaging/newMessage/newMessageLog';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../types';
import NewMessageLogRepository from '../../../repositories/Logging/messaging/newMessage/newMessageLogRepository';

@injectable()
export class NewMessageLogService {
    constructor(@inject(TYPES.NewMessageLogRepository) private newMessageRepo: NewMessageLogRepository) {}
    /**
     * create
     */
    public create(message: Message): void {
        if (message.attachments.size > 0) {
            let log: NewMessageLog = {
                userName: message.author.username,
                messageId: message.id,
                userId: message.author.id,
                channelId: message.channelId,
                channelName: message.guild.channels.cache.get(message.channelId).name,
                date: message.createdAt,
            };
            if (message.content === null) {
                let attachments: Array<string> = [];
                message.attachments.forEach((attachment) => {
                    attachments.push(attachment.name);
                });
                log.attachments = attachments;
            } else {
                let attachments: Array<string> = [];
                message.attachments.forEach((attachment) => {
                    attachments.push(attachment.name);
                });
                log.attachments = attachments;
                log.message = message.content;
            }

            this.newMessageRepo.CreateLog(log);
            return;
        }
        const log: NewMessageLog = {
            userName: message.author.username,
            messageId: message.id,
            userId: message.author.id,
            channelId: message.channelId,
            channelName: message.guild.channels.cache.get(message.channelId).name,
            message: message.content,
            date: message.createdAt,
        };
        this.newMessageRepo.CreateLog(log);
        return;
    }
}
