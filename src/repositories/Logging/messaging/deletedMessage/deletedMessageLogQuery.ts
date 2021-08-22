import { FilterQuery, Types } from 'mongoose';
import DeletedMessageLog from '../../../../domain/Logging/Messaging/deletedMessage/deletedMessageLog';

export default interface deletedMessageQuerybyId extends FilterQuery<DeletedMessageLog> {
    _id: Types.ObjectId;
}
