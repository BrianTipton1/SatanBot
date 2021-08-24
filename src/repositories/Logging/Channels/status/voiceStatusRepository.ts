import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import MongoBase from '../../../mongoBase';
import VoiceStatus from '../../../../domain/Logging/Channels/status/voiceStatus';
import VoiceStatusModel from '../../../../domain/Logging/Channels/status/voiceStatusModel';
import { VoiceStatusQuerybyId, VoiceStatusQuerybyUserId } from './voiceStatusQuery';

@injectable()
export default class VoiceStatusRepository extends MongoBase<VoiceStatus> {
    constructor() {
        super(VoiceStatusModel);
    }
    /**
     *
     * @param log Audit Object to be posted to Mongo
     * @returns  Promise<VoiceStatus & Document<any, any, VoiceStatus>>
     */
    public async CreateLog(log: VoiceStatus): Promise<VoiceStatus & Document<any, any, VoiceStatus>> {
        try {
            return await this.create(log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    public async GetMany(userId: string) {
        const query: VoiceStatusQuerybyUserId = {
            userId: userId,
        };
        try {
            return await this.getMany(query);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(VoiceStatus & Document<any, any, VoiceStatus>) | null>
     */
    public async GetLog(id: string): Promise<(VoiceStatus & Document<any, any, VoiceStatus>) | null> {
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
    public async UpdateLogById(id: string, log: VoiceStatus): Promise<UpdateWriteOpResult> {
        const query: VoiceStatusQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
