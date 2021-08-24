import { FilterQuery, Types } from 'mongoose';
import VoiceTime from '../../../../domain/Logging/Channels/time/voiceTime';

export default interface VoiceTimeQuerybyId extends FilterQuery<VoiceTime> {
    _id: Types.ObjectId;
}
