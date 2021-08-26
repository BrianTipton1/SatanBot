import { Message, StartThreadOptions } from 'discord.js';
import { inject, injectable } from 'inversify';
import TierList from '../../domain/tierlist/tierList';
import TierListRepository from '../../repositories/tierlist/tierListRepository';
import { TYPES } from '../../types';

@injectable()
export class TierListService {
    private tierListRepo: TierListRepository;
    constructor(@inject(TYPES.TierListRepository) tierListRepo: TierListRepository) {
        this.tierListRepo = tierListRepo;
    }
    private getThreadName(message: Message): string {
        const splits: Array<string> = message.content.split(' ');
        let threadName: string = '';
        for (let i = 0; i < splits.length; i++) {
            if (!splits[i].includes('-')) {
                threadName += splits[i] + ' ';
            }
        }
        if (threadName.length !== 0) {
            return threadName.charAt(0).toUpperCase() + threadName.slice(1).slice(0, -1);
        }
        return 'null';
    }
    async startTierList(message: Message) {
        if (!(message.content.includes('-num') || message.content.includes('-alpha'))) {
            message.reply(
                `Hey, <@${message.author.id}> to create a tier list please provide ` +
                    `a type option.\nOptions are -alpha or -num\nExample command: '-tierlist -alpha BestBurgers'`,
            );
            return;
        }
        if (message.content.includes('-alpha') && !message.content.includes('-num')) {
            const threadName = this.getThreadName(message);
            this.createTierList(message, 'alpha', threadName);
            const threadOptions: StartThreadOptions = {
                name: `${this.getThreadName(message)} Tier List`,
                autoArchiveDuration: 1440,
                reason: 'aplha',
            };
            const thread = await message.startThread(threadOptions);
            thread.messages.channel.send(
                `Hey <@${message.author.id}> I created a thread for your ${threadName} Tier List! It expires after 24 hours.` +
                    `\nWhen you are finished with the list type -finish in the thread!\n` +
                    "In order to add something to a specific letter on the list add a '-' and the" +
                    " letter you want!\nExample: '-s Arbys Frys'" +
                    'To print the current standings type -print',
            );
        }
        if (message.content.includes('-num') && !message.content.includes('-alpha')) {
            const threadName = this.getThreadName(message);
            this.createTierList(message, 'num', threadName);
            const threadOptions: StartThreadOptions = {
                name: `${this.getThreadName(message)} Tier List`,
                autoArchiveDuration: 1440,
                reason: 'numeric',
            };
            const thread = await message.startThread(threadOptions);
            thread.messages.channel.send(
                `Hey <@${message.author.id}> I created a thread for your ${threadName} Tier List! It expires after 24 hours.` +
                    `\nWhen you are finished with the list type -finish in the thread!\n` +
                    'In order to add something to a specific number on the list add a ' +
                    "'-' and the number you want!\nExample: '-2 Arbys Frys'\n" +
                    'If you assign two items to the same number the most recent item assigned will be on the list\n' +
                    'To print the current standings type -print',
            );
        }
    }
    private async createTierList(message: Message, tierType: string, threadName: string) {
        const tierList: TierList = {
            tierListAuthor: message.author.username,
            tierListAuthorId: message.author.id,
            tierListType: tierType,
            tierListName: threadName,
            dateCreated: new Date(),
        };
        this.tierListRepo.Createitem(tierList);
    }
}
