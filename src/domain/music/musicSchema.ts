import { Schema } from 'mongoose';
import Music from './music';

const MusicSchema = new Schema<Music>({
    name: { type: String, required: true },
    songs: { type: Array, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    date: { type: Date, required: true },
});
export default MusicSchema;
