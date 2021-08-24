import { VoiceState } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { VoiceStatusService } from '../logging/Channels/voiceStatusService';
import { VoiceTimeService } from '../logging/Channels/voiceTimeService';

@injectable()
export class ChannelService {
    private voiceTimeService: VoiceTimeService;
    private voiceStatusService: VoiceStatusService;
    constructor(
        @inject(TYPES.VoiceTimeService) voiceTimeService: VoiceTimeService,
        @inject(TYPES.VoiceStatusService) voiceStatusService: VoiceStatusService,
    ) {
        this.voiceTimeService = voiceTimeService;
        this.voiceStatusService = voiceStatusService;
    }
    async handleVoiceState(oldState: VoiceState, newState: VoiceState) {
        await this.voiceTimeService.calculateTime(newState);
        await this.voiceStatusService.setStatus(newState);
    }
}
