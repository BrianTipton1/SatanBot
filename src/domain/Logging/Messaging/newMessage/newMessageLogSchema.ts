import { Schema } from 'mongoose';
import NewMessageLog from './newMessageLog';

const NewMessageLogSchema = new Schema<NewMessageLog>({
    userName: { type: String, required: true },
    message: { type: String, required: false },
    messageId: { type: String, required: true },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
    channelName: { type: String, required: true },
    channelId: { type: String, required: true },
    attachments: { type: Array, required: false },
});
export default NewMessageLogSchema;
