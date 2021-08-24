import { model } from 'mongoose';
import VoiceTime from './voiceTime';
import VoiceTimeSchema from './voiceTimeSchema';

const VoiceTimeModel = model<VoiceTime>('VoiceTime', VoiceTimeSchema);
export default VoiceTimeModel;
