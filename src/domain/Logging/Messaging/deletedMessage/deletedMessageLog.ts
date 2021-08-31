export default interface DeletedMessageLog {
    userName: string;
    message?: string;
    messageId: string;
    createdDate: Date;
    userId: string;
    channelName: string;
    channelId: string;
}
