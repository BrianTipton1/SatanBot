import {
    ActivityFlags,
    ActivityOptions,
    Client,
    GuildMember,
    Message,
    PresenceData,
    PresenceStatusData,
    VoiceState,
} from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { MessageService } from '../services/message/messageService';
import { ChannelService } from '../services/channel/channelService';
import { MemberService } from '../services/member/memberService';
import { ActivityTypes } from 'discord.js/typings/enums';

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;
    private messageService: MessageService;
    private channelService: ChannelService;
    private memberService: MemberService;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.MessageService) messageService: MessageService,
        @inject(TYPES.ChannelService) channelService: ChannelService,
        @inject(TYPES.MemberService) memberService: MemberService,
    ) {
        this.client = client;
        this.token = token;
        this.messageService = messageService;
        this.channelService = channelService;
        this.memberService = memberService;
    }

    public listen(): Promise<string> {
        this.client.on('messageCreate', (message: Message) => {
            if (message.author.bot) {
                return;
            }
            try {
                this.messageService.handleNewMessage(message);
            } catch (error) {
                console.log(error);
                throw new Error('Error on message creation');
            }
        });
        this.client.on('messageUpdate', (oldMessage: Message, newMessage: Message) => {
            try {
                this.messageService.handleUpdatedMessage(oldMessage, newMessage);
            } catch (error) {
                console.log(error);
                throw new Error('Error on message update');
            }
        });
        this.client.on('messageDelete', (message: Message) => {
            try {
                this.messageService.handleDeletedMessage(message);
            } catch (error) {
                console.log(error);
                throw new Error('Error on message delete');
            }
        });
        this.client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
            this.channelService.handleVoiceState(oldState, newState);
        });
        this.client.on('guildMemberAdd', (member: GuildMember) => {
            this.memberService.handleMemberStatus(member);
            this.memberService.sendWelcome(member);
        });
        this.client.on('guildMemberRemove', (member: GuildMember) => {
            this.memberService.handleMemberStatus(member);
        });
        this.client.on('ready', () => {
            const opt: ActivityOptions = {
                type: 2,
            };
            this.client.user.setActivity('The Devil Went Down to Georgia', opt);
        });
        return this.client.login(this.token);
    }
}
