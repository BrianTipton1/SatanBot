export default interface Playlist {
    name: string;
    songs: Array<string>;
    creatorId: string;
    creatorName: string;
    dateCreated: Date;
}
