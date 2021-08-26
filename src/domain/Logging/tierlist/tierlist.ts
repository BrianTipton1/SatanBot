import TierItem from './tierItem';

export default interface tierList {
    tierListName: string;
    tierListAuthor: string;
    tierListId: string;
    dateCreated: Date;
    tierItems?: Array<TierItem>;
}
