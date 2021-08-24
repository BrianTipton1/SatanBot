import { Schema } from 'mongoose';
import voiceStatus from './voiceStatus';

const VoiceStatusSchema = new Schema<voiceStatus>({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    channelName: { type: String, required: false },
    channelId: { type: String, required: false },
    connected: { type: Boolean, required: true },
    date: { type: Date, required: true },
});
export default VoiceStatusSchema;
