import MongoBase from '../mongoBase';
import MessageAuditQuerybyId from './messageLogQuery';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import MessageLog from '../../domain/messageLogging/messageLog';
import MessageLogModel from '../../domain/messageLogging/messageLogModel';

@injectable()
export default class LogRepository extends MongoBase<MessageLog> {
    constructor() {
        super(MessageLogModel);
    }
    /**
     *
     * @param audit Audit Object to be posted to Mongo
     * @returns  Promise<MessageLog & Document<any, any, MessageLog>>
     */
    public async CreateLog(audit: MessageLog): Promise<MessageLog & Document<any, any, MessageLog>> {
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
    public async GetAudit(id: string): Promise<(MessageLog & Document<any, any, MessageLog>) | null> {
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
    public async UpdateAuditById(id: string, audit: MessageLog): Promise<UpdateWriteOpResult> {
        const query: MessageAuditQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, audit);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
