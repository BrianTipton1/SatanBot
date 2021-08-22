import { Message } from 'discord.js';
import MessageLog from '../../domain/messageLogging/messageLog';
import { inject, injectable } from 'inversify';
import MessageAuditRepository from '../../repositories/messageLog/MessageAuditRepository';
import { TYPES } from '../../types';

@injectable()
export class MessageAuditService {
    constructor(@inject(TYPES.MessageAuditRepository) private repo: MessageAuditRepository) {}
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
