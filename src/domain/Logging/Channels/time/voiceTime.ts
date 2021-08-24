//time is the number of milliseconds spent in a voice channel
export default interface VoiceTime {
    userName: string;
    userId: string;
    channelName: string;
    channelId: string;
    time: number;
    date: Date;
}
