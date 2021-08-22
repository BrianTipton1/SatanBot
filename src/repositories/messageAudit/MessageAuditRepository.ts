import MongoBase from '../mongoBase';
import MessageAuditQuerybyId from './messageAuditQuery';
import MessageAuditModel from '../../domain/messageAudit/messageAuditModel';
import MessageAudit from '../../domain/messageAudit/messageAudit';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export default class AuditRepository extends MongoBase<MessageAudit> {
    constructor() {
        super(MessageAuditModel);
    }
    /**
     *
     * @param audit Audit Object to be posted to Mongo
     * @returns  Promise<MessageAudit & Document<any, any, MessageAudit>>
     */
    public async CreateAudit(audit: MessageAudit): Promise<MessageAudit & Document<any, any, MessageAudit>> {
        try {
            return await this.create(audit);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(MessageAudit & Document<any, any, MessageAudit>) | null>
     */
    public async GetAudit(id: string): Promise<(MessageAudit & Document<any, any, MessageAudit>) | null> {
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
    public async UpdateAuditById(id: string, audit: MessageAudit): Promise<UpdateWriteOpResult> {
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
