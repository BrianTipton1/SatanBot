import MongoBase from '../../../mongoBase';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import DeletedMessageLog from '../../../../domain/Logging/Messaging/deletedMessage/deletedMessageLog';
import DeletedMessageLogModel from '../../../../domain/Logging/Messaging/deletedMessage/deletedMessageLogModel';
import deletedMessageQuerybyId from './deletedMessageLogQuery';

@injectable()
export default class DeletedMessageLogRepository extends MongoBase<DeletedMessageLog> {
    constructor() {
        super(DeletedMessageLogModel);
    }
    /**
     *
     * @param log Audit Object to be posted to Mongo
     * @returns  Promise<DeletedMessageLog & Document<any, any, DeletedMessageLog>>
     */
    public async CreateLog(log: DeletedMessageLog): Promise<DeletedMessageLog & Document<any, any, DeletedMessageLog>> {
        try {
            return await this.create(log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(DeletedMessageLog & Document<any, any, DeletedMessageLog>) | null>
     */
    public async GetLog(id: string): Promise<(DeletedMessageLog & Document<any, any, DeletedMessageLog>) | null> {
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
    public async UpdateLogById(id: string, log: DeletedMessageLog): Promise<UpdateWriteOpResult> {
        const query: deletedMessageQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
