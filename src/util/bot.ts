import { Client, Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { MessageService } from '../services/message/messageService';

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;
    private messageService: MessageService;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.MessageService) messageResponder: MessageService,
    ) {
        this.client = client;
        this.token = token;
        this.messageService = messageResponder;
    }

    public listen(): Promise<string> {
        this.client.on('messageCreate', (message: Message) => {
            if (message.author.bot) {
                console.log('Ignoring bot message!');
                return;
            }

            console.log('Message received! Contents: ', message.content);

            try {
                this.messageService.handleNewMessage(message);
            } catch (error) {
                throw new Error('Error on message creation');
            }
        });
        this.client.on('messageUpdate', (oldMessage: Message, newMessage: Message) => {
            try {
                this.messageService.handleUpdatedMessage(oldMessage, newMessage);
            } catch (error) {
                throw new Error('Error on message update');
            }
        });

        return this.client.login(this.token);
    }
}
