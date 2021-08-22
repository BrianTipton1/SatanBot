import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { EditedMessageLogService } from '../logging/editedMessageLogService';
import { NewMessageLogService } from '../logging/newMessageLogService';

@injectable()
export class MessageService {
    private newMessageLogService: NewMessageLogService;
    private editedMessageLogService: EditedMessageLogService;
    constructor(
        @inject(TYPES.MessageLogService) newMessageLogService: NewMessageLogService,
        @inject(TYPES.EditedMessageLogService) editedMessageLogService: EditedMessageLogService,
    ) {
        this.newMessageLogService = newMessageLogService;
        this.editedMessageLogService = editedMessageLogService;
    }

    async handleNewMessage(message: Message) {
        this.newMessageLogService.create(message);
    }
    async handleUpdatedMessage(oldMessage: Message, newMessage: Message) {
        this.editedMessageLogService.create(oldMessage, newMessage);
    }
}
