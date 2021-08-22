import MongoBase from '../../../mongoBase';
import newMessageQuerybyId from './newMessageLogQuery';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import NewMessageLog from '../../../../domain/Logging/Messaging/newMessage/newMessageLog';
import NewMessageLogModel from '../../../../domain/Logging/Messaging/newMessage/newMessageLogModel';

@injectable()
export default class NewMessageLogRepository extends MongoBase<NewMessageLog> {
    constructor() {
        super(NewMessageLogModel);
    }
    /**
     *
     * @param log Audit Object to be posted to Mongo
     * @returns  Promise<MessageLog & Document<any, any, MessageLog>>
     */
    public async CreateLog(log: NewMessageLog): Promise<NewMessageLog & Document<any, any, NewMessageLog>> {
        try {
            return await this.create(log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(MessageLog & Document<any, any, MessageLog>) | null>
     */
    public async GetLog(id: string): Promise<(NewMessageLog & Document<any, any, NewMessageLog>) | null> {
        try {
            return await this.getById(id);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to update
     * @param log Updated Audit Object
     * @returns  Promise<UpdateWriteOpResult>
     */
    public async UpdateLogById(id: string, log: NewMessageLog): Promise<UpdateWriteOpResult> {
        const query: newMessageQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
