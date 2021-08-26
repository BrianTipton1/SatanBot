import { model } from 'mongoose';
import TierList from './tierList';
import TierListSchema from './tierListSchema';

const TierListModel = model<TierList>('TierList', TierListSchema);
export default TierListModel;
