import { model } from 'mongoose';
import DeletedMessageLog from './deletedMessageLog';
import DeletedMessageSchema from './deletedMessageLogSchema';

const DeletedMessageLogModel = model<DeletedMessageLog>('DeletedMessageLog', DeletedMessageSchema);
export default DeletedMessageLogModel;
