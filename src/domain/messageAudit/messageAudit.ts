export default interface MessageAudit {
    user: string;
    message: string;
    date: Date;
    userId: string;
    media?: boolean;
}
