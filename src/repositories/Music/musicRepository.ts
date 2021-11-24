import { Document, ObjectId, Types, UpdateWriteOpResult } from 'mongoose';
import { injectable } from 'inversify';
import Music from '../../domain/music/music';
import MongoBase from '../mongoBase';
import MusicModel from '../../domain/music/musicModel';
import MusicQueryById from './musicQuery';
import MusicQueryByName from './musicQueryByName';

@injectable()
export default class MusicRepository extends MongoBase<Music> {
    constructor() {
        super(MusicModel);
    }
    /**
     *
     * @param playlist Log Object to be posted to Mongo
     * @returns  Promise<Music & Document<any, any, Music>>
     */
    public async CreatePlaylist(playlist: Music): Promise<Music & Document<any, any, Music>> {
        try {
            return await this.create(playlist);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    public async GetPlaylist(name: string) {
        const query: MusicQueryByName = {
            name: name,
        };
        try {
            return await this.getMostTenRecent(query);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    /**
     *
     * @param id Id of the Log to update
     * @param log Updated Log Object
     * @returns  Promise<UpdateWriteOpResult>
     */
    public async UpdateLogById(id: Types.ObjectId, log: Music): Promise<UpdateWriteOpResult> {
        const query: MusicQueryById = {
            _id: id,
        };
        try {
            return await this.update(query, log);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    public async deleteByName(name: string) {
        const query: MusicQueryByName = {
            name: name,
        };
        await this.delete(query);
    }
}
