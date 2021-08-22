import { model } from 'mongoose';
import MessageAudit from './messageAudit';
import MessageAuditSchema from './messageAuditSchema';

const UserModel = model<MessageAudit>('MessageAudit', MessageAuditSchema);
export default UserModel;
