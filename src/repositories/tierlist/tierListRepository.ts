import MongoBase from '../mongoBase';
import { Document, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import TierList from '../../domain/tierlist/tierList';
import TierListModel from '../../domain/tierlist/tierListModel';
import QuerybyTierListThreadId from './tierListQuerybyId';

@injectable()
export default class TierListRepository extends MongoBase<TierList> {
    constructor() {
        super(TierListModel);
    }
    /**
     *
     * @param item Object to be posted to Mongo
     * @returns  Promise<TierList & Document<any, any, TierList>>
     */
    public async Createitem(item: TierList): Promise<TierList & Document<any, any, TierList>> {
        try {
            return await this.create(item);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the item to get
     * @returns Promise<(TierList & Document<any, any, TierList>) | null>
     */
    public async getTierList(id: string): Promise<(TierList & Document<any, any, TierList>)[]> {
        const query: QuerybyTierListThreadId = { tierListThreadId: id };
        try {
            return await this.getMostTenRecent(query);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the item to update
     * @param item Updated item Object
     * @returns  Promise<UpdateWriteOpResult>
     */
    public async UpdateitemByTierListId(tierListId: string, item: TierList): Promise<UpdateWriteOpResult> {
        const query: QuerybyTierListThreadId = {
            tierListThreadId: tierListId,
        };
        try {
            return await this.update(query, item);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
}
