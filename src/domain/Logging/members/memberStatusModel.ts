import { model } from 'mongoose';
import MemberStatus from './memberStatus';
import MemberStatusSchema from './memberStatusSchema';

const MemberStatusModel = model<MemberStatus>('MemberStatus', MemberStatusSchema);
export default MemberStatusModel;
