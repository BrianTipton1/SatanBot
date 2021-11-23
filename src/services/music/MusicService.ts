import { DiscordGatewayAdapterCreator, DiscordGatewayAdapterLibraryMethods, joinVoiceChannel } from '@discordjs/voice';
import { OptionValues } from 'commander';
import { GatewayVoiceServerUpdateDispatchData, GatewayVoiceStateUpdateDispatchData } from 'discord-api-types';
import { Client, Constants, Guild, Message, Snowflake, StageChannel, VoiceChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import Music from '../../domain/music/music';
import MusicRepository from '../../repositories/Music/musicRepository';
import { TYPES } from '../../types';

@injectable()
export class MusicService {
    private musicRepo: MusicRepository;
    private adapters: Map<Snowflake, DiscordGatewayAdapterLibraryMethods>;
    private trackedShards: Map<number, Set<Snowflake>>;
    private trackedClients: Set<Client>;

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
    private CheckIfInVoice(message: Message): boolean {
        if (!message.member.voice.channel) {
            return false;
        }
        return true;
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

    public async HandleMusic(message: Message, options: OptionValues) {
        if (options.play !== undefined) {
            if (this.CheckIfPlaylistExists('QUE')) {
                this.AddToQue(message, options);
            } else {
                this.StartQue(message, options);
            }
            return;
        }
        if (options.music !== undefined) {
            if (options.music === 'play') {
                const channel = await this.getChannel(message);
                if (channel) {
                    let connection = await joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: this.createDiscordJSAdapter(channel as VoiceChannel),
                    });
                    try {
                        await connection.on;
                    } catch (error) {}
                } else {
                    return;
                }
            }
        } else {
            message.reply('Something went wrong :(');
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
            message.reply('Something went wrong :(, please try again');
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
