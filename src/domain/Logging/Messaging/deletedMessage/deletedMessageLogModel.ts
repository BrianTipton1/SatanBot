import { model } from 'mongoose';
import DeletedMessageLog from './deletedMessageLog';
import DeletedMessageSchema from './deletedMessageLogSchema';

const DeletedMessageLogModel = model<DeletedMessageLog>('DeletedMessage', DeletedMessageSchema);
export default DeletedMessageLogModel;
