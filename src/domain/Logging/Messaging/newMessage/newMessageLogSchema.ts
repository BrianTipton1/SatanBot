import { Schema } from 'mongoose';
import NewMessageLog from './newMessageLog';

const NewMessageLogSchema = new Schema<NewMessageLog>({
    userName: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
    channelName: { type: String, required: true },
    channelId: { type: String, required: true },
});
export default NewMessageLogSchema;
