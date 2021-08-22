import { Message } from 'discord.js';
import MessageLog from '../../domain/messageLogging/messageLog';
import { inject, injectable } from 'inversify';
import MessageLogRepository from '../../repositories/messageLog/messageLogRepository';
import { TYPES } from '../../types';

@injectable()
export class MessageLogService {
    constructor(@inject(TYPES.MessageLogRepository) private repo: MessageLogRepository) {}
    /**
     * create
     */
    public create(message: Message): void {
        const audit: MessageLog = {
            user: message.author.username,
            userId: message.author.id,
            message: message.content,
            date: message.createdAt,
        };
        this.repo.CreateAudit(audit);
    }
}
