import { Schema } from 'mongoose';
import MessageLog from './messageLog';

const MessageLogSchema = new Schema<MessageLog>({
    user: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
});
export default MessageLogSchema;
