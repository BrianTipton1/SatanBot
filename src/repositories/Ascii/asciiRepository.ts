import { injectable } from 'inversify';
import Ascii from '../../domain/Ascii/ascii';
import { Document } from 'mongoose';
import AsciiModel from '../../domain/Ascii/asciiModel';
import MongoBase from '../mongoBase';
import AsciiQuerybyName from './asciiQuery';

@injectable()
export default class AsciiRepository extends MongoBase<Ascii> {
    constructor() {
        super(AsciiModel);
    }
    public async CreateAscii(ascii: Ascii): Promise<Ascii & Document<any, any, Ascii>> {
        try {
            return await this.create(ascii);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    public async GetAscii(name: string): Promise<(Ascii & Document<any, any, Ascii>)[]> {
        const query: AsciiQuerybyName = {
            artName: name,
        };
        try {
            return await this.getMostTenRecent(query);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    public async DeleteAscii(name: string) {
        const query: AsciiQuerybyName = {
            artName: name,
        };
        try {
            return await this.delete(query);
        } catch (error) {
            throw new Error('Could not connect to mongo: ' + error);
        }
    }
    public async GetAllArt() {
        return await this.getAll();
    }
}
