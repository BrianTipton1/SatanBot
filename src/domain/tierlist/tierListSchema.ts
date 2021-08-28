import { Schema } from 'mongoose';
import TierList from './tierList';

const TierListSchema = new Schema<TierList>({
    tierListName: { type: String, required: true },
    tierListThreadId: { type: String, required: true },
    tierListAuthor: { type: String, required: true },
    tierListAuthorId: { type: String, required: true },
    tierListType: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    tierItems: { type: Array, required: false },
});
export default TierListSchema;
