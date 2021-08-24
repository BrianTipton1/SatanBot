import { Schema } from 'mongoose';
import VoiceTime from './voiceTime';

const VoiceTimeSchema = new Schema<VoiceTime>({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    channelName: { type: String, required: true },
    channelId: { type: String, required: true },
    time: { type: Number, required: true },
    date: { type: Date, required: true },
});
export default VoiceTimeSchema;
