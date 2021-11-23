import { Message, StartThreadOptions, ThreadChannel, ThreadMember } from 'discord.js';
import { inject, injectable } from 'inversify';
import TierList from '../../domain/tierlist/tierList';
import TierListRepository from '../../repositories/tierlist/tierListRepository';
import { TYPES } from '../../types';
import { Document } from 'mongoose';
import TierItem from '../../domain/tierlist/tierItem';
import Table = require('cli-table');
import { OptionValues } from 'commander';

@injectable()
export class TierListService {
    private tierListRepo: TierListRepository;
    constructor(@inject(TYPES.TierListRepository) tierListRepo: TierListRepository) {
        this.tierListRepo = tierListRepo;
    }

    async startTierList(message: Message, options: OptionValues) {
        if (options.tierlist === 'alpha') {
            const threadName = options.name;
            const threadOptions: StartThreadOptions = {
                name: `${threadName} tier list`,
                autoArchiveDuration: 1440,
                reason: 'alpha',
            };
            const thread = await message.startThread(threadOptions);
            this.createTierList(message, 'alpha', threadName, thread.id);
            thread.messages.channel.send(
                `Hey <@${message.author.id}> I created a thread for your ${threadName} tier list! It expires after 24 hours.` +
                    `\nWhen you are finished with the list type -finish in the thread!\n` +
                    "In order to add something to a specific letter on the list add a '-' and the" +
                    " letter you want!\nExample: '-s Arbys Frys'\n" +
                    'To print the current standings type -print',
            );
        }
        if (options.tierlist == 'num') {
            const threadName = options.name;
            const threadOptions: StartThreadOptions = {
                name: `${threadName} tier list`,
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
    private async sleep(milliseconds: number) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
    private async countdown(message: Message) {
        await message.channel.send('5');
        await this.sleep(1000);
        await message.channel.send('4');
        await this.sleep(1000);
        await message.channel.send('3');
        await this.sleep(1000);
        await message.channel.send('2');
        await this.sleep(1000);
        await message.channel.send('1');
        await this.sleep(1000);
    }
    private async archiveThread(message: Message) {
        const chan = await message.client.channels.fetch(message.channelId);
        const thread = chan as ThreadChannel;
        await thread.setArchived(true);
    }
    private async handleNumTierCommand(message: Message, tierlist: TierList) {
        if (message.content.includes('-finish')) {
            const table = this.generateTable(tierlist);
            message.channel.send('Displaying final results in.....');
            await this.countdown(message);
            await message.reply(table);
            await this.archiveThread(message);
            return;
        }
        if (message.content.includes('-print')) {
            message.reply(this.generateTable(tierlist));
            return;
        }
        if (
            this.getSetTier(message) === null ||
            typeof this.getSetTier(message) === 'string' ||
            this.getItem(message) === null
        ) {
            message.reply(
                `<@${message.author.id}> to set a item to a specific tier use the command character and the letter or number you want to assign\n` +
                    'Example: -1 BigMac',
            );
            return;
        }
        for (let i = 0; i < tierlist.tierItems.length; i++) {
            if (tierlist.tierItems[i].tier === this.getSetTier(message)) {
                tierlist.tierItems[i].tier = null;
            }
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
        if (message.content.includes('-finish')) {
            const table = this.generateTable(tierlist);
            message.channel.send('Displaying final results in.....');
            await this.countdown(message);
            await message.reply(table);
            await this.archiveThread(message);
            return;
        }
        if (message.content.includes('-print')) {
            const table = this.generateTable(tierlist);
            message.reply(table);
            return;
        }
        if (
            this.getSetTier(message) === null ||
            typeof this.getSetTier(message) === 'number' ||
            this.getItem(message) === null
        ) {
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
        if (items.length > 2) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].includes('-')) {
                    items.splice(i, 1);
                }
            }
            return items.join(' ');
        }
        return null;
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
            if (match.length > 1) {
                return null;
            }
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

    private generateTable(tierList: TierList) {
        if (tierList.tierListType === 'alpha') {
            const table = new Table({
                chars: {
                    top: '═',
                    'top-mid': '╤',
                    'top-left': '╔',
                    'top-right': '╗',
                    bottom: '═',
                    'bottom-mid': '╧',
                    'bottom-left': '╚',
                    'bottom-right': '╝',
                    left: '║',
                    'left-mid': '╟',
                    mid: '─',
                    'mid-mid': '┼',
                    right: '║',
                    'right-mid': '╢',
                    middle: '│',
                },
                head: [`${tierList.tierListName} Tier List`],
            });
            let alltiers: Array<string> = [];
            for (let i = 0; i < tierList.tierItems.length; i++) {
                alltiers.push(tierList.tierItems[i].tier as string);
            }
            let tiers = [...new Set(alltiers)];
            tiers = tiers.sort();
            for (let tier = 0; tier < tiers.length; tier++) {
                let letteritems: Array<string> = [];
                for (let items = 0; items < tierList.tierItems.length; items++) {
                    if (tiers[tier] === tierList.tierItems[items].tier) {
                        letteritems.push(tierList.tierItems[items].item);
                    }
                }
                const onestr = letteritems.join(' ');
                if (tiers[tier] === 's') {
                    table.unshift({ [`${tiers[tier].toUpperCase()}`]: onestr });
                } else {
                    table.push({ [`${tiers[tier].toUpperCase()}`]: onestr });
                }
            }
            return '`' + table.toString() + '`';
        }
        if (tierList.tierListType === 'num') {
            const table = new Table({
                chars: {
                    top: '═',
                    'top-mid': '╤',
                    'top-left': '╔',
                    'top-right': '╗',
                    bottom: '═',
                    'bottom-mid': '╧',
                    'bottom-left': '╚',
                    'bottom-right': '╝',
                    left: '║',
                    'left-mid': '╟',
                    mid: '─',
                    'mid-mid': '┼',
                    right: '║',
                    'right-mid': '╢',
                    middle: '│',
                },
                head: [`${tierList.tierListName} Tier List`],
            });
            let nums: Array<number> = [];
            for (let i = 0; i < tierList.tierItems.length; i++) {
                nums.push(tierList.tierItems[i].tier as number);
            }
            let tiers = [...new Set(nums)];
            tiers = tiers.sort();
            for (let i = 0; i < tiers.length; i++) {
                for (let tier = 0; tier < tierList.tierItems.length; tier++) {
                    if (tierList.tierItems[tier].tier === null) {
                        continue;
                    }
                    if (tiers[i] === tierList.tierItems[tier].tier) {
                        table.push({ [`${tiers[i]}`]: tierList.tierItems[tier].item });
                    }
                }
            }
            return '`' + table.toString() + '`';
        }
    }
}
