import MongoBase from '../../mongoBase';
import newMessageQuerybyId from './editedMessageLogQuery';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import EditedMessageLogModel from '../../../domain/Logging/editedMessage/editedMessageLogModel';
import EditedMessageLog from '../../../domain/Logging/editedMessage/editedMessageLog';

@injectable()
export default class EditedMessageLogRepository extends MongoBase<EditedMessageLog> {
    constructor() {
        super(EditedMessageLogModel);
    }
    /**
     *
     * @param audit Audit Object to be posted to Mongo
     * @returns  Promise<EditedMessageLog & Document<any, any, EditedMessageLog>>
     */
    public async CreateLog(audit: EditedMessageLog): Promise<EditedMessageLog & Document<any, any, EditedMessageLog>> {
        try {
            return await this.create(audit);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(EditedMessageLog & Document<any, any, EditedMessageLog>) | null>
     */
    public async GetAudit(id: string): Promise<(EditedMessageLog & Document<any, any, EditedMessageLog>) | null> {
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
    public async UpdateAuditById(id: string, audit: EditedMessageLog): Promise<UpdateWriteOpResult> {
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
