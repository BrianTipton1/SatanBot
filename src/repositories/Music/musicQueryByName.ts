import { FilterQuery, Types } from 'mongoose';
import Music from '../../domain/music/music';

export default interface MusicQueryByName extends FilterQuery<Music> {
    name: string;
}
