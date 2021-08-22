import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import DeletedMessageLog from '../../domain/Logging/Messaging/deletedMessage/deletedMessageLog';
import { TYPES } from '../../types';
import { DeletedMessageLogService } from '../logging/messaging/deletedMessageLogService';
import { EditedMessageLogService } from '../logging/messaging/editedMessageLogService';
import { NewMessageLogService } from '../logging/messaging/newMessageLogService';

@injectable()
export class MessageService {
    private newMessageLogService: NewMessageLogService;
    private editedMessageLogService: EditedMessageLogService;
    private deletedMessageLogService: DeletedMessageLogService;
    constructor(
        @inject(TYPES.MessageLogService) newMessageLogService: NewMessageLogService,
        @inject(TYPES.EditedMessageLogService) editedMessageLogService: EditedMessageLogService,
        @inject(TYPES.DeletedMessageLogService) deletedMessageLogService: DeletedMessageLogService,
    ) {
        this.newMessageLogService = newMessageLogService;
        this.editedMessageLogService = editedMessageLogService;
        this.deletedMessageLogService = deletedMessageLogService;
    }

    async handleNewMessage(message: Message) {
        this.newMessageLogService.create(message);
    }
    async handleUpdatedMessage(oldMessage: Message, newMessage: Message) {
        this.editedMessageLogService.create(oldMessage, newMessage);
    }
    async handleDeletedMessage(message: Message) {
        this.deletedMessageLogService.create(message);
    }
}
