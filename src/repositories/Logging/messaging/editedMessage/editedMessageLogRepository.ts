import MongoBase from '../../../mongoBase';
import editedMessageQuerybyId from './editedMessageLogQuery';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import EditedMessageLogModel from '../../../../domain/Logging/Messaging/editedMessage/editedMessageLogModel';
import EditedMessageLog from '../../../../domain/Logging/Messaging/editedMessage/editedMessageLog';

@injectable()
export default class EditedMessageLogRepository extends MongoBase<EditedMessageLog> {
    constructor() {
        super(EditedMessageLogModel);
    }
    /**
     *
     * @param log Audit Object to be posted to Mongo
     * @returns  Promise<EditedMessageLog & Document<any, any, EditedMessageLog>>
     */
    public async CreateLog(log: EditedMessageLog): Promise<EditedMessageLog & Document<any, any, EditedMessageLog>> {
        try {
            return await this.create(log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(EditedMessageLog & Document<any, any, EditedMessageLog>) | null>
     */
    public async GetLog(id: string): Promise<(EditedMessageLog & Document<any, any, EditedMessageLog>) | null> {
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
    public async UpdateLogById(id: string, log: EditedMessageLog): Promise<UpdateWriteOpResult> {
        const query: editedMessageQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
