import { model } from 'mongoose';
import NewMessageLog from './newMessageLog';
import NewMessageLogSchema from './newMessageLogSchema';

const NewMessageLogModel = model<NewMessageLog>('NewMessage', NewMessageLogSchema);
export default NewMessageLogModel;
