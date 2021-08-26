import { Channel, Client, Message, StartThreadOptions } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';

@injectable()
export class TierListService {
    constructor() {}
    private getThreadName(message: Message): string {
        const splits: Array<string> = message.content.split(' ');
        let threadName: string = '';
        for (let i = 0; i < splits.length; i++) {
            if (!splits[i].includes('-')) {
                threadName += splits[i] + ' ';
            }
        }
        return threadName;
    }
    async startTierList(message: Message) {
        if (message.content.includes('-alpha')) {
            const thread: StartThreadOptions = {
                name: `${this.getThreadName(message)}`,
                autoArchiveDuration: 1440,
                reason: 'aplha',
            };
            message.startThread(thread);
            message.reply(
                `Hey ${message.author.username} I created a thread for this tierlist!. It expires after 24 hours.\nWhen you are finished with the list type -finish in the thread!`,
            );
            message.reply(
                "To add something to a specific letter on the list, add a - and the letter you want! Example: '-s Arbys Frys'",
            );
        }
        if (message.content.includes('-num')) {
            const thread: StartThreadOptions = {
                name: `${this.getThreadName(message)}`,
                autoArchiveDuration: 1440,
                reason: 'numeric',
            };
            message.startThread(thread);
            message.reply(
                `Hey ${message.author.username} I created a thread for this tierlist!. It expires after 24 hours.\nWhen you are finished with the list type -finish in the thread!`,
            );
            message.reply(
                "To add something to a specific number on the list, add a - and the number you want! Example: '-1 Arbys Frys'",
            );
        } else {
            message.reply(
                `${message.author.username} to create a tier list please provide` +
                    `a type option. Options are -alpha or -num Example: '-tierlist -alpha BestBurgers'`,
            );
        }
    }
}
