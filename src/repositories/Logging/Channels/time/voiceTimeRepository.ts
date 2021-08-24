import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import VoiceTime from '../../../../domain/Logging/Channels/time/voiceTime';
import MongoBase from '../../../mongoBase';
import VoiceTimeModel from '../../../../domain/Logging/Channels/time/voiceTimeModel';
import VoiceTimeQuerybyId from './voiceTimeLogQuery';

@injectable()
export default class VoiceTimeRepository extends MongoBase<VoiceTime> {
    constructor() {
        super(VoiceTimeModel);
    }
    /**
     *
     * @param log Audit Object to be posted to Mongo
     * @returns  Promise<VoiceTime & Document<any, any, VoiceTime>>
     */
    public async CreateLog(log: VoiceTime): Promise<VoiceTime & Document<any, any, VoiceTime>> {
        try {
            return await this.create(log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Audit to get
     * @returns Promise<(VoiceTime & Document<any, any, VoiceTime>) | null>
     */
    public async GetLog(id: string): Promise<(VoiceTime & Document<any, any, VoiceTime>) | null> {
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
    public async UpdateLogById(id: string, log: VoiceTime): Promise<UpdateWriteOpResult> {
        const query: VoiceTimeQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
