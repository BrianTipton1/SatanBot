import { FilterQuery, Types } from 'mongoose';
import MemberStatus from '../../../domain/Logging/members/memberStatus';

export default interface memberStatusQuerybyId extends FilterQuery<MemberStatus> {
    _id: Types.ObjectId;
}
