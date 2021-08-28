import { Message, StartThreadOptions, Channel } from 'discord.js';
import { inject, injectable } from 'inversify';
import TierList from '../../domain/tierlist/tierList';
import TierListRepository from '../../repositories/tierlist/tierListRepository';
import { TYPES } from '../../types';
import { Document } from 'mongoose';
import TierItem from '../../domain/tierlist/tierItem';

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
        return null;
    }
    async startTierList(message: Message) {
        if (!(message.content.includes('-num') || message.content.includes('-alpha'))) {
            message.reply(
                `Hey, <@${message.author.id}> to create a Tier List please provide ` +
                    `a type option.\nOptions are -alpha or -num\nExample command: '-tierlist -alpha BestBurgers'`,
            );
            return;
        }
        if (message.content.includes('-alpha') && !message.content.includes('-num')) {
            const threadName = this.getThreadName(message);
            const threadOptions: StartThreadOptions = {
                name: `${this.getThreadName(message)} tier list`,
                autoArchiveDuration: 1440,
                reason: 'aplha',
            };
            const thread = await message.startThread(threadOptions);
            this.createTierList(message, 'alpha', threadName, thread.id);
            thread.messages.channel.send(
                `Hey <@${message.author.id}> I created a thread for your ${threadName} tier list! It expires after 24 hours.` +
                    `\nWhen you are finished with the list type -finish in the thread!\n` +
                    "In order to add something to a specific letter on the list add a '-' and the" +
                    " letter you want!\nExample: '-s Arbys Frys'" +
                    'To print the current standings type -print',
            );
        }
        if (message.content.includes('-num') && !message.content.includes('-alpha')) {
            const threadName = this.getThreadName(message);
            const threadOptions: StartThreadOptions = {
                name: `${this.getThreadName(message)} tier list`,
                autoArchiveDuration: 1440,
                reason: 'numeric',
            };
            const thread = await message.startThread(threadOptions);
            this.createTierList(message, 'num', threadName, thread.id);
            thread.messages.channel.send(
                `Hey <@${message.author.id}> I created a thread for your ${threadName} tier list! It expires after 24 hours.` +
                    `\nWhen you are finished with the list type -finish in the thread!\n` +
                    'In order to add something to a specific number on the list add a ' +
                    "'-' and the number you want!\nExample: '-2 Arbys Frys'\n" +
                    'If you assign two items to the same number the most recent item assigned will be on the list\n' +
                    'To print the current standings type -print',
            );
        }
    }
    private async createTierList(message: Message, tierType: string, threadName: string, tierListId: string) {
        const tierList: TierList = {
            tierListAuthor: message.author.username,
            tierListAuthorId: message.author.id,
            tierListType: tierType,
            tierListName: threadName,
            tierListThreadId: tierListId,
            dateCreated: new Date(),
        };
        this.tierListRepo.Createitem(tierList);
    }
    private async getTierList(message: Message) {
        return await this.tierListRepo.getTierList(message.channelId);
    }
    public async handleTierListCommand(message: Message) {
        const tierlist = await this.getTierList(message);
        if (tierlist.length === 0) {
            message.reply('There was an issue retrieving the tierlist from Mongo\nUnable to update list');
        }
        if (tierlist[0] !== null && tierlist[0].tierListType === 'num') {
            this.handleNumTierCommand(message, this.docToDomain(tierlist));
        }
        if (tierlist[0] !== null && tierlist[0].tierListType === 'alpha') {
            this.handleAlphaTierCommand(message, this.docToDomain(tierlist));
        }
    }
    private async handleNumTierCommand(message: Message, tierlist: TierList) {
        if (this.getSetTier(message) === null || typeof this.getSetTier(message) === 'string') {
            message.reply(
                `<@${message.author.id}> to set a item to a specific tier use the command character and the letter or number you want to assign\n` +
                    'Example: -1 BigMac',
            );
            return;
        }
        let item: TierItem = {
            tier: this.getSetTier(message),
            item: this.getItem(message),
            assigner: message.author.username,
            assignerId: message.author.id,
        };
        tierlist.tierItems.push(item);
        await this.tierListRepo.UpdateitemByTierListId(message.channel.id, tierlist);
    }

    private async handleAlphaTierCommand(message: Message, tierlist: TierList) {
        if (this.getSetTier(message) === null || typeof this.getSetTier(message) === 'number') {
            message.reply(
                `<@${message.author.id}> to set a item to a specific tier use the command character and the letter or number you want to assign\n` +
                    'Example: -s BigMac',
            );
            return;
        }
        let item: TierItem = {
            tier: this.getSetTier(message),
            item: this.getItem(message),
            assigner: message.author.username,
            assignerId: message.author.id,
        };
        tierlist.tierItems.push(item);
        await this.tierListRepo.UpdateitemByTierListId(message.channel.id, tierlist);
    }
    private getItem(message: Message) {
        const items = message.content.split(' ');
        if (items.length === 2) {
            return items[1];
        }
    }
    private getSetTier(message: Message) {
        const re = /-\w\w\w|-\w\w|-\w/;
        const result = message.content.match(re);
        if ((result === null && result[0] === null) || result.length > 1) {
            return null;
        }
        let match = result[0];
        match = match.substring(1);
        if (parseInt(match)) {
            return parseInt(match);
        } else {
            return match;
        }
    }
    private docToDomain(doc: (TierList & Document<any, any, TierList>)[]) {
        if (doc !== null && doc[0] !== null) {
            let tier: TierList = {
                tierListName: doc[0].tierListName,
                tierListThreadId: doc[0].tierListThreadId,
                tierListType: doc[0].tierListType,
                dateCreated: doc[0].dateCreated,
                tierListAuthor: doc[0].tierListAuthor,
                tierListAuthorId: doc[0].tierListAuthorId,
            };
            if (doc[0].tierItems !== null) {
                tier.tierItems = doc[0].tierItems;
            }
            return tier;
        }
    }
}
