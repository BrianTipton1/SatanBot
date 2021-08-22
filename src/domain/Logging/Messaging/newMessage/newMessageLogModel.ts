import { model } from 'mongoose';
import NewMessageLog from './newMessageLog';
import NewMessageLogSchema from './newMessageLogSchema';

const NewMessageLogModel = model<NewMessageLog>('NewMessageLog', NewMessageLogSchema);
export default NewMessageLogModel;
