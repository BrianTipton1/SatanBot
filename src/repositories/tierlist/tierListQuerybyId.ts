import { FilterQuery, Types } from 'mongoose';
import TierList from '../../domain/tierlist/tierList';

export default interface QuerybyTierListThreadId extends FilterQuery<TierList> {
    tierListThreadId: string;
}
