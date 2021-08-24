import { model } from 'mongoose';
import EditedMessageLog from './editedMessageLog';
import EditedMessageSchema from './editedMessageLogSchema';

const EditedMessageLogModel = model<EditedMessageLog>('EditedMessage', EditedMessageSchema);
export default EditedMessageLogModel;
