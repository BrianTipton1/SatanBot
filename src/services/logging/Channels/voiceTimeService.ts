import { inject, injectable } from 'inversify';
import VoiceTimeRepository from '../../../repositories/Logging/Channels/time/voiceTimeRepository';
import { TYPES } from '../../../types';
import { VoiceState } from 'discord.js';
import VoiceStatusRepository from '../../../repositories/Logging/Channels/status/voiceStatusRepository';
import { VoiceStatusService } from './voiceStatusService';

@injectable()
export class VoiceTimeService {
    private voiceStatusRepo: VoiceStatusRepository;
    private voiceTimeRepo: VoiceTimeRepository;
    private voiceStatusService: VoiceStatusService;
    constructor(
        @inject(TYPES.VoiceStatusRepository) VoiceStatusRepo: VoiceStatusRepository,
        @inject(TYPES.VoiceTimeRepository) VoiceTimeRepo: VoiceTimeRepository,
        @inject(TYPES.VoiceStatusService) VoiceStatusService: VoiceStatusService,
    ) {
        this.voiceStatusRepo = VoiceStatusRepo;
        this.voiceTimeRepo = VoiceTimeRepo;
        this.voiceStatusService = VoiceStatusService;
    }
    private async getLastStatus(userId: string) {
        const resp = await this.voiceStatusRepo.GetMany(userId);
        if (resp !== null) {
            return resp[resp.length - 1];
        }
        return null;
    }
    public async calculateTime(newStatus: VoiceState) {
        const oldStatus = await this.getLastStatus(newStatus.member.id);
        console.log('test');
    }
}
