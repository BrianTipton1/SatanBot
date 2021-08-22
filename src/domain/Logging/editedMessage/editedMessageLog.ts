export default interface EditedMessageLog {
    userName: string;
    originalMessage: string;
    updatedMessage: string;
    createdDate: Date;
    updatedDate: Date;
    userId: string;
    channelName: string;
    channelId: string;
}
