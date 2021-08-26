import TierItem from './tierItem';

export default interface TierList {
    tierListName: string;
    tierListAuthor: string;
    tierListAuthorId: string;
    tierListType: string;
    dateCreated: Date;
    tierItems?: Array<TierItem>;
}
