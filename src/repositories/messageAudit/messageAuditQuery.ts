import { FilterQuery, Types } from 'mongoose';
import MessageAudit from '../../domain/messageAudit/messageAudit';

export default interface MessageAuditQuerybyId extends FilterQuery<MessageAudit> {
    _id: Types.ObjectId;
}
