export default interface NewMessageLog {
    userName: string;
    message?: string;
    date: Date;
    userId: string;
    channelName: string;
    channelId: string;
    attachments?: Array<string>;
}
