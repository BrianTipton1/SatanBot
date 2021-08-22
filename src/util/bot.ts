import { Client, Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { MessageService } from '../services/message/messageService';

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;
    private messageResponder: MessageService;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.MessageService) messageResponder: MessageService,
    ) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
    }

    public listen(): Promise<string> {
        this.client.on('messageCreate', (message: Message) => {
            if (message.author.bot) {
                console.log('Ignoring bot message!');
                return;
            }

            console.log('Message received! Contents: ', message.content);

            try {
                this.messageResponder.handle(message);
            } catch (error) {
                console.log(error);
            }
        });

        return this.client.login(this.token);
    }
}
