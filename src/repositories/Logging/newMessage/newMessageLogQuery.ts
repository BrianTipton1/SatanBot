import { FilterQuery, Types } from 'mongoose';
import NewMessageLog from '../../../domain/Logging/newMessage/newMessageLog';

export default interface newMessageQuerybyId extends FilterQuery<NewMessageLog> {
    _id: Types.ObjectId;
}
