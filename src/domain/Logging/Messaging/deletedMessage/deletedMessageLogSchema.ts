import { Schema } from 'mongoose';
import DeletedMessageLog from './deletedMessageLog';

const DeletedMessageSchema = new Schema<DeletedMessageLog>({
    userName: { type: String, required: true },
    messageId: { type: String, required: true },
    message: { type: String, required: false },
    createdDate: { type: Date, required: true },
    userId: { type: String, required: true },
    channelName: { type: String, required: true },
    channelId: { type: String, required: true },
});
export default DeletedMessageSchema;
