import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { MessageLogService } from '../logging/MessageLogService';

@injectable()
export class MessageService {
    private messageLogService: MessageLogService;

    constructor(@inject(TYPES.MessageLogService) messageLogService: MessageLogService) {
        this.messageLogService = messageLogService;
    }

    async handle(message: Message) {
        this.messageLogService.create(message);
    }
}
