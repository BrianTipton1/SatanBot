export default interface VoiceStatus {
    userName: string;
    userId: string;
    channelName?: string;
    channelId?: string;
    connected?: boolean;
    date: Date;
}
