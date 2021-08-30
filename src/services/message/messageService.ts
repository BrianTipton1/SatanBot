import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import DeletedMessageLog from '../../domain/Logging/Messaging/deletedMessage/deletedMessageLog';
import { TYPES } from '../../types';
import { CommandService } from '../command/commandService';
import { DeletedMessageLogService } from '../logging/messaging/deletedMessageLogService';
import { EditedMessageLogService } from '../logging/messaging/editedMessageLogService';
import { NewMessageLogService } from '../logging/messaging/newMessageLogService';
import { TierListService } from '../tierlist/tierlistService';

@injectable()
export class MessageService {
    private newMessageLogService: NewMessageLogService;
    private editedMessageLogService: EditedMessageLogService;
    private deletedMessageLogService: DeletedMessageLogService;
    private commandService: CommandService;
    constructor(
        @inject(TYPES.MessageLogService) newMessageLogService: NewMessageLogService,
        @inject(TYPES.EditedMessageLogService) editedMessageLogService: EditedMessageLogService,
        @inject(TYPES.DeletedMessageLogService) deletedMessageLogService: DeletedMessageLogService,
        @inject(TYPES.CommandService) commandService: CommandService,
    ) {
        this.newMessageLogService = newMessageLogService;
        this.editedMessageLogService = editedMessageLogService;
        this.deletedMessageLogService = deletedMessageLogService;
        this.commandService = commandService;
    }

    private checkIfCommand(message: Message) {
        if (message.content.includes('-')) {
            return true;
        }
        return false;
    }
    async handleNewMessage(message: Message) {
        if (message.type === 'DEFAULT') {
            this.newMessageLogService.create(message);
            if (this.checkIfCommand(message)) {
                this.commandService.handleCommand(message);
            }
        }
    }
    async handleUpdatedMessage(oldMessage: Message, newMessage: Message) {
        this.editedMessageLogService.create(oldMessage, newMessage);
    }
    async handleDeletedMessage(message: Message) {
        this.deletedMessageLogService.create(message);
    }
}
