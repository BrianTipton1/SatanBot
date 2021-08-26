import { FilterQuery, Types } from 'mongoose';
import TierList from '../../domain/tierlist/tierList';

export default interface TierListQuerybyId extends FilterQuery<TierList> {
    _id: Types.ObjectId;
}
