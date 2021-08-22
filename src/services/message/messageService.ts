import { Message } from 'discord.js';
import { PingFinder } from '../ping-finder';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { MessageAuditService } from '../logging/MessageAuditService';

@injectable()
export class MessageService {
    private messageAuditService: MessageAuditService;

    constructor(@inject(TYPES.MessageAuditService) messageAuditService: MessageAuditService) {
        this.messageAuditService = messageAuditService;
    }

    async handle(message: Message) {
        this.messageAuditService.create(message);
    }
}
