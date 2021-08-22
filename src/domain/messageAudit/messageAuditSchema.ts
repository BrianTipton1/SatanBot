import { Schema } from 'mongoose';
import MessageAudit from './messageAudit';

const UserSchema = new Schema<MessageAudit>({
    user: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
    media: { type: Boolean, required: false },
});
export default UserSchema;
