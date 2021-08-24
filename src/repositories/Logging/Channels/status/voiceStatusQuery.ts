import { FilterQuery, Types } from 'mongoose';
import VoiceStatus from '../../../../domain/Logging/Channels/status/voiceStatus';

export interface VoiceStatusQuerybyId extends FilterQuery<VoiceStatus> {
    _id: Types.ObjectId;
}
export interface VoiceStatusQuerybyUserId extends FilterQuery<VoiceStatus> {
    userId: string;
}
