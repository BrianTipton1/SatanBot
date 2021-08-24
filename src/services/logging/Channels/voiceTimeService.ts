import { inject, injectable } from 'inversify';
import VoiceTimeRepository from '../../../repositories/Logging/Channels/time/voiceTimeRepository';
import { TYPES } from '../../../types';
import { VoiceState } from 'discord.js';
import VoiceStatusRepository from '../../../repositories/Logging/Channels/status/voiceStatusRepository';
import { VoiceStatusService } from './voiceStatusService';
import VoiceTime from '../../../domain/Logging/Channels/time/voiceTime';

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
        const resp = await this.voiceStatusRepo.GetTenMostRecent(userId);
        if (resp.length !== 0) {
            return resp[0];
        }
        return null;
    }
    public async calculateTime(newStatus: VoiceState) {
        const oldStatus = await this.getLastStatus(newStatus.member.id);
        if (oldStatus === null) {
            return;
        }
        if (oldStatus.connected === true && newStatus.channel !== null) {
            return;
        }
        if (oldStatus.connected === true && newStatus.channel === null) {
            const timeNow = new Date();
            const timeInChannel = timeNow.getTime() - oldStatus.date.getTime();
            const vTime: VoiceTime = {
                userName: newStatus.member.displayName,
                userId: newStatus.member.id,
                channelName: oldStatus.channelName,
                channelId: oldStatus.channelId,
                time: timeInChannel,
                date: timeNow,
            };
            await this.voiceTimeRepo.CreateLog(vTime);
        }
    }
}
