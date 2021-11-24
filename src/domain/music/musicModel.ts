import { model } from 'mongoose';
import Music from './music';
import MusicSchema from './musicSchema';

const MusicModel = model<Music>('music', MusicSchema);
export default MusicModel;
