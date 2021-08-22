import { FilterQuery, Types } from 'mongoose';
import MessageLog from '../../domain/messageLogging/messageLog';

export default interface MessageAuditQuerybyId extends FilterQuery<MessageLog> {
    _id: Types.ObjectId;
}
