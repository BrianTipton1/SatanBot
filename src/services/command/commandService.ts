import { Message, ThreadChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { TierListService } from '../tierlist/tierlistService';

@injectable()
export class CommandService {
    private tierListService: TierListService;
    constructor(@inject(TYPES.TierListService) tierListService: TierListService) {
        this.tierListService = tierListService;
    }
    public async handleCommand(message: Message) {
        if (message.channel.isThread()) {
            this.handleThreadCommand(message);
        }
        if (message.content.includes('tierlist')) {
            this.tierListService.startTierList(message);
        }
        if (message.content.includes('help')) {
            message.reply(
                'Satan bot currently only has one command currently\n\n' +
                    '"-tierlist" --> Create a tierlist either an "S tier list" or a numbered list\n' +
                    'Example tierlist command "-tierlist -alpha Hamburgers" or "-tierlist -num Hamburgers"',
            );
        }
    }
    private async handleThreadCommand(message: Message) {}
}
