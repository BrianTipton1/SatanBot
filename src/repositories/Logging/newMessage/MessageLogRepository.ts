import MongoBase from '../../mongoBase';
import newMessageQuerybyId from './newMessageLogQuery';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import NewMessageLog from '../../../domain/Logging/newMessage/newMessageLog';
import NewMessageLogModel from '../../../domain/Logging/newMessage/newMessageLogModel';

@injectable()
export default class LogRepository extends MongoBase<NewMessageLog> {
    constructor() {
        super(NewMessageLogModel);
    }
    /**
     *
     * @param audit Audit Object to be posted to Mongo
     * @returns  Promise<MessageLog & Document<any, any, MessageLog>>
     */
    public async CreateLog(audit: NewMessageLog): Promise<NewMessageLog & Document<any, any, NewMessageLog>> {
        try {
            return await this.create(audit);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(MessageLog & Document<any, any, MessageLog>) | null>
     */
    public async GetAudit(id: string): Promise<(NewMessageLog & Document<any, any, NewMessageLog>) | null> {
        try {
            return await this.getById(id);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to update
     * @param audit Updated Audit Object
     * @returns  Promise<UpdateWriteOpResult>
     */
    public async UpdateAuditById(id: string, audit: NewMessageLog): Promise<UpdateWriteOpResult> {
        const query: newMessageQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, audit);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
