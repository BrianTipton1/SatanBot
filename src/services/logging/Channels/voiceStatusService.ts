import { VoiceState } from 'discord.js';
import { inject, injectable } from 'inversify';
import VoiceStatus from '../../../domain/Logging/Channels/status/voiceStatus';
import VoiceStatusRepository from '../../../repositories/Logging/Channels/status/voiceStatusRepository';
import { TYPES } from '../../../types';

@injectable()
export class VoiceStatusService {
    private voiceStatusRepo: VoiceStatusRepository;
    constructor(@inject(TYPES.VoiceStatusRepository) VoiceStatusRepo: VoiceStatusRepository) {
        this.voiceStatusRepo = VoiceStatusRepo;
    }
    public setStatus(newState: VoiceState) {
        let status: VoiceStatus;
        status = {
            userName: newState.member.displayName,
            userId: newState.member.id,
            date: new Date(),
        };
        if (newState.channel !== null) {
            status.connected = true;
            status.channelName = newState.channel.name;
            status.channelId = newState.channel.id;
        } else {
            status.connected = false;
        }
        this.voiceStatusRepo.CreateLog(status);
    }
}
