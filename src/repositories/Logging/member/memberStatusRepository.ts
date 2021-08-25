import MongoBase from '../../mongoBase';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import MemberStatus from '../../../domain/Logging/members/memberStatus';
import MemberStatusModel from '../../../domain/Logging/members/memberStatusModel';
import memberStatusQuerybyId from './memberStatusQuery';

@injectable()
export default class MemberStatusRepository extends MongoBase<MemberStatus> {
    constructor() {
        super(MemberStatusModel);
    }
    /**
     *
     * @param log log Object to be posted to Mongo
     * @returns  Promise<MemberStatus & Document<any, any, MemberStatus>>
     */
    public async CreateLog(log: MemberStatus): Promise<MemberStatus & Document<any, any, MemberStatus>> {
        try {
            return await this.create(log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the log to get
     * @returns Promise<(MemberStatus & Document<any, any, MemberStatus>) | null>
     */
    public async GetLog(id: string): Promise<(MemberStatus & Document<any, any, MemberStatus>) | null> {
        try {
            return await this.getById(id);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the log to update
     * @param log Updated log Object
     * @returns  Promise<UpdateWriteOpResult>
     */
    public async UpdateLogById(id: string, log: MemberStatus): Promise<UpdateWriteOpResult> {
        const query: memberStatusQuerybyId = {
            _id: this.toObjectId(id),
        };
        try {
            return await this.update(query, log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
