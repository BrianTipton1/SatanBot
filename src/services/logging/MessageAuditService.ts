import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import MessageAudit from '../../domain/messageAudit/messageAudit';
import MessageAuditRepository from '../../repositories/messageAudit/MessageAuditRepository';
import { TYPES } from '../../types';

@injectable()
export class MessageAuditService {
    constructor(@inject(TYPES.MessageAuditRepository) private repo: MessageAuditRepository) {}
    /**
     * create
     */
    public create(message: Message): void {
        const audit: MessageAudit = {
            user: message.author.username,
            userId: message.author.id,
            message: message.content,
            date: message.createdAt,
        };
        this.repo.CreateAudit(audit);
    }
}
