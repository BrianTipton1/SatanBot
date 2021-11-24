import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    DiscordGatewayAdapterLibraryMethods,
    joinVoiceChannel,
    VoiceConnection,
} from '@discordjs/voice';
import { Document } from 'mongoose';
import { OptionValues } from 'commander';
import { GatewayVoiceServerUpdateDispatchData, GatewayVoiceStateUpdateDispatchData } from 'discord-api-types';
import { Client, Constants, Guild, Message, Snowflake, StageChannel, VoiceChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import ytdl from 'ytdl-core';
import Music from '../../domain/music/music';
import MusicRepository from '../../repositories/Music/musicRepository';
import { TYPES } from '../../types';

@injectable()
export class MusicService {
    private musicRepo: MusicRepository;
    private adapters: Map<Snowflake, DiscordGatewayAdapterLibraryMethods>;
    private trackedShards: Map<number, Set<Snowflake>>;
    private trackedClients: Set<Client>;
    private player: AudioPlayer;
    private connection: VoiceConnection;

    constructor(@inject(TYPES.MusicRepository) musicRepo: MusicRepository) {
        this.musicRepo = musicRepo;
        this.trackedShards = new Map<number, Set<Snowflake>>();
        this.trackedClients = new Set<Client>();
        this.adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
    }
    private async CheckIfPlaylistExists(name: string): Promise<boolean> {
        const resp = await this.musicRepo.GetPlaylist(name);
        if (resp.length === 0) {
            return false;
        }
        return true;
    }
    private async CheckIfQueEmpty() {
        const resp = await this.musicRepo.GetPlaylist('QUE');
        if (resp[0].songs.length === 0) {
            await this.musicRepo.deleteByName('QUE');
            return true;
        }
        return false;
    }
    private SendNotInChannel(message: Message): void {
        message.reply('Sorry you have to be in a voice channel to play, pause or stop music');
    }
    private async getChannel(message: Message): Promise<false | VoiceChannel | StageChannel> {
        const channel = message.member.voice.channel;
        if (!channel) {
            await this.SendNotInChannel(message);
            return false;
        }
        return channel;
    }

    private async trackClient(client: Client) {
        if (this.trackedClients.has(client)) return;
        this.trackedClients.add(client);
        client.ws.on(Constants.WSEvents.VOICE_SERVER_UPDATE, (payload: GatewayVoiceServerUpdateDispatchData) => {
            this.adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
        });
        client.ws.on(Constants.WSEvents.VOICE_STATE_UPDATE, (payload: GatewayVoiceStateUpdateDispatchData) => {
            if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
                this.adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload as any);
            }
        });
        client.on(Constants.Events.SHARD_DISCONNECT, (_, shardID) => {
            const guilds = this.trackedShards.get(shardID);
            if (guilds) {
                for (const guildID of guilds.values()) {
                    this.adapters.get(guildID)?.destroy();
                }
            }
            this.trackedShards.delete(shardID);
        });
    }
    private createDiscordJSAdapter(channel: VoiceChannel): DiscordGatewayAdapterCreator {
        return (methods) => {
            this.adapters.set(channel.guild.id, methods);
            this.trackClient(channel.client);
            this.trackGuild(channel.guild);
            return {
                sendPayload(data) {
                    if (channel.guild.shard.status === Constants.Status.READY) {
                        channel.guild.shard.send(data);
                        return true;
                    }
                    return false;
                },
                destroy() {
                    return this.this.adapters.delete(channel.guild.id);
                },
            };
        };
    }
    private async trackGuild(guild: Guild) {
        let guilds = this.trackedShards.get(guild.shardId);
        if (!guilds) {
            guilds = new Set();
            this.trackedShards.set(guild.shardId, guilds);
        }
        guilds.add(guild.id);
    }
    private CheckIfInVoice(message: Message): boolean {
        if (!message.member.voice.channel) {
            return false;
        }
        return true;
    }
    private async GetNextQue() {
        const resp = await this.musicRepo.GetPlaylist('QUE');
        if (resp[0].songs.length === 0) {
            this.musicRepo.deleteByName('QUE');
            return false;
        }
        return resp[0].songs[0];
    }
    private pause() {
        if (this.player !== undefined) {
            this.player.pause();
        }
    }
    private unpause() {
        if (this.player !== undefined) {
            this.player.unpause();
        }
    }
    private skip() {
        if (this.player !== undefined) {
            this.player.stop();
        }
    }
    private stop() {
        if (this.player !== undefined) {
            this.player.stop();
            this.connection.disconnect();
        }
    }
    private async PlayNextInQue(url: string, connection: VoiceConnection, message: Message) {
        try {
            const stream = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25, dlChunkSize: 0 });
            const player = createAudioPlayer();
            this.player = player;
            this.connection = connection;
            player.play(createAudioResource(stream));
            connection.subscribe(player).player.on('stateChange', async (old, n) => {
                if (n.status === AudioPlayerStatus.Idle) {
                    if (await this.CheckIfPlaylistExists('QUE')) {
                        await this.deleteFromQue();
                        const next = await this.GetNextQue();
                        if (next === false) {
                            connection.disconnect();
                            return;
                        }
                        await this.PlayNextInQue(next, connection, message);
                    }
                }
            });
        } catch (error) {
            message.reply(`There was an error playing ${url}`);
        }
    }
    private async connect(message: Message): Promise<VoiceConnection> {
        const channel = await this.getChannel(message);
        if (channel) {
            let connection = await joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: this.createDiscordJSAdapter(channel as VoiceChannel),
            });
            return connection;
        } else {
            return;
        }
    }
    private async checkUrl(url: string, message: Message) {
        if (await ytdl.validateURL(url)) {
            return true;
        }
        message.reply('The URL provided cannot be played');
        return false;
    }

    public async HandleMusic(message: Message, options: OptionValues) {
        if (options.play !== undefined && (await this.checkUrl(options.play, message))) {
            if ((await this.CheckIfPlaylistExists('QUE')) && (await this.CheckIfQueEmpty())) {
                const connection = await this.connect(message);
                this.AddToQue(message, options);
                this.PlayNextInQue(options.play, connection, message);
                return;
            }
            if (!(await this.CheckIfPlaylistExists('QUE'))) {
                const connection = await this.connect(message);
                this.StartQue(message, options);
                this.PlayNextInQue(options.play, connection, message);
                return;
            }
            if (!(await this.CheckIfQueEmpty())) {
                this.AddToQue(message, options);
                return;
            }
            return;
        }
        if (options.music !== undefined) {
            if (options.music === 'pause') {
                this.pause();
            }
            if (options.music === 'play') {
                this.unpause();
            }
            if (options.music === 'stop') {
                this.stop();
            }
            if (options.music === 'skip') {
                this.skip();
            }
        }
    }
    private async deleteFromQue() {
        const resp = await this.musicRepo.GetPlaylist('QUE');
        if (resp.length !== 0) {
            let que = resp[0];
            let newQue: Music = {
                name: que.name,
                userName: que.userName,
                userId: que.userId,
                songs: que.songs,
                date: que.date,
            };
            newQue.songs.shift();
            await this.musicRepo.UpdateLogById(que._id, newQue);
        }
    }
    private async AddToQue(message: Message, options: OptionValues) {
        const resp = await this.musicRepo.GetPlaylist('QUE');
        if (resp.length !== 0) {
            let que = resp[0];
            let newQue: Music = {
                name: que.name,
                userName: que.userName,
                userId: que.userId,
                songs: que.songs,
                date: que.date,
            };
            newQue.songs.push(options.play);
            await this.musicRepo.UpdateLogById(que._id, newQue);
        } else {
            message.reply('Something went wrong adding to que:(, please try again');
        }
    }
    private StartQue(message: Message, options: OptionValues) {
        const que: Music = {
            name: 'QUE',
            userName: message.client.user.username,
            userId: message.client.user.id,
            songs: [options.play],
            date: new Date(),
        };
        this.musicRepo.CreatePlaylist(que);
    }

    private async startPlayList(message: Message, options: OptionValues) {
        if (this.CheckIfPlaylistExists(options.name)) {
            message.reply(
                'Sorry a playlist with this name already exists!\nYou can add songs to this playlist or create a new one with a different name!',
            );
            return false;
        }
        if (options.play !== undefined && options.play === 'create' && options.name !== undefined) {
            const playlist: Music = {
                name: options.name,
                userName: message.author.username,
                userId: message.author.id,
                date: new Date(),
                songs: new Array(),
            };
            await this.musicRepo.CreatePlaylist(playlist);
            return true;
        }
        if (options.play !== undefined && options.play === undefined) {
            return false;
        }
    }
}
