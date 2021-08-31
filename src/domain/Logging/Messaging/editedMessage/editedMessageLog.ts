export default interface EditedMessageLog {
    userName: string;
    originalMessage?: string;
    messageId: string;
    updatedMessage: string;
    createdDate: Date;
    updatedDate: Date;
    userId: string;
    channelName: string;
    channelId: string;
}
