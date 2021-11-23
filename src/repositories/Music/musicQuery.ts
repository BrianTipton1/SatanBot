import { FilterQuery, Types } from 'mongoose';
import Music from '../../domain/music/music';

export default interface MusicQueryById extends FilterQuery<Music> {
    _id: Types.ObjectId;
}
