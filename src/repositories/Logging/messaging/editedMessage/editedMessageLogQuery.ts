import { FilterQuery, Types } from 'mongoose';
import EditedMessageLog from '../../../../domain/Logging/Messaging/editedMessage/editedMessageLog';

export default interface editedMessageQuerybyId extends FilterQuery<EditedMessageLog> {
    _id: Types.ObjectId;
}
