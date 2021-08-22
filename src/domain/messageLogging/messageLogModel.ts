import { model } from 'mongoose';
import MessageLog from './messageLog';
import MessageLogSchema from './messageLogSchema';

const MessageLogModel = model<MessageLog>('MessageLog', MessageLogSchema);
export default MessageLogModel;
