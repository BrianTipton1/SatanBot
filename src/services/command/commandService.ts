import { Message, StartThreadOptions } from 'discord.js';
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
        if (message.content.includes('tierlist')) {
            this.tierListService.startTierList(message);
        }
    }
    private commandType(message: Message) {
        if (message.content.includes('tierlist')) {
            this.tierListService.startTierList(message);
        }
    }
}
