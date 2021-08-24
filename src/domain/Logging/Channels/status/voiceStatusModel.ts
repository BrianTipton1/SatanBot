import { model } from 'mongoose';
import VoiceStatus from './voiceStatus';
import VoiceStatusSchema from './voiceStatusSchema';

const VoiceTimeModel = model<VoiceStatus>('voiceStatus', VoiceStatusSchema);
export default VoiceTimeModel;
