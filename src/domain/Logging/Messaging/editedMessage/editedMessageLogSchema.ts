import { Schema } from 'mongoose';
import EditedMessageLog from './editedMessageLog';

const EditedMessageSchema = new Schema<EditedMessageLog>({
    userName: { type: String, required: true },
    originalMessage: { type: String, required: true },
    updatedMessage: { type: String, required: true },
    createdDate: { type: Date, required: true },
    updatedDate: { type: Date, required: true },
    userId: { type: String, required: true },
    channelName: { type: String, required: true },
    channelId: { type: String, required: true },
});
export default EditedMessageSchema;
