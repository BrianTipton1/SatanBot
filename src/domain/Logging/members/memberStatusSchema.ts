import { Schema } from 'mongoose';
import MemberStatus from './memberStatus';

const MemberStatusSchema = new Schema<MemberStatus>({
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    joined: { type: Boolean, required: false },
    left: { type: Boolean, required: false },
    date: { type: Date, required: true },
});
export default MemberStatusSchema;
