import { FilterQuery, Types } from 'mongoose';
import EditedMessageLog from '../../../domain/Logging/editedMessage/editedMessageLog';

export default interface newMessageQuerybyId extends FilterQuery<EditedMessageLog> {
    _id: Types.ObjectId;
}
