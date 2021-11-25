import { Message, ThreadChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { AsciiService } from '../ascii/asciiService';
import { TierListService } from '../tierlist/tierlistService';
import { Argument, Command, CommanderError, Option, OptionValues } from 'commander';
import { MusicService } from '../music/MusicService';
import { RollService } from '../roll/rollService';
import { FlipService } from '../flip/flipService';
@injectable()
export class CommandService {
    private tierListService: TierListService;
    private asciiService: AsciiService;
    private program: Command;
    private musicService: MusicService;
    private rollService: RollService;
    private flipService: FlipService;
    constructor(
        @inject(TYPES.TierListService) tierListService: TierListService,
        @inject(TYPES.AsciiService) asciiService: AsciiService,
        @inject(TYPES.MusicService) musicService: MusicService,
        @inject(TYPES.RollService) rollService: RollService,
        @inject(TYPES.FlipService) flipService: FlipService,
    ) {
        this.tierListService = tierListService;
        this.asciiService = asciiService;
        this.musicService = musicService;
        this.rollService = rollService;
        this.flipService = flipService;
    }
    private NameCommand() {
        const name = new Option('-n, --name <Name of Item>');
        this.program.addOption(name);
    }
    private MusicCommand() {
        const music = new Option(
            '-m, --music <action>',
            '\n\
        stop -(Stops music playing in channel)\n\
        play -(Start Playing a playlist with a name parameter)\n\
        unpause -(Unpause currntly paused music)\n\
        pause -(Pauses Currently Playing Music)\n\
        create - (Create a playlist witha name parameter)\n\
        delete - (Delete a playlist with a name parameter)\n\
        add - (Add music to a playlist with a name and value parameter)\n\
        skip - (skips the current song and starts playing the next in que or next in playlist)\n',
        );
        music.choices(['unpause', 'stop', 'skip', 'pause', 'play', 'create', 'delete', 'add']);
        this.program.addOption(music);
    }
    private PlayCommand() {
        const play = new Option(
            '-p, --play <Url to youtube video>',
            "\n\
        Used to just que music w/o playlist\n\
        Example '--play http://someyoutubesong.com)'",
        );
        this.program.addOption(play);
    }
    private rollCommand() {
        const roll = new Option(
            '-r, --roll [69-420]',
            "\n\
        Can supply a low and high or no value to roll from 0-100\n\
        Example: '--roll 69-420'\n",
        ).default('default');
        this.program.addOption(roll);
    }
    private flipCommand() {
        const flip = new Option('-f, --flip', '\n\
        Flips a coin');
        this.program.addOption(flip);
    }
    private ArtCommand() {
        const art = new Option('-v, --value <Some value to be saved>');
        this.program.addOption(art);
    }
    private AsciiCommand() {
        const ascii = new Option(
            '-a, --ascii <Action to preform>',
            "Need to specifiy a name with the -n flag and art with -v flag.\n\
            Example: '-a save -n chungus -v INSERT-ASCII-HERE\n",
        );
        ascii.choices(['save', 'delete', 'post', 'list']);
        this.program.addOption(ascii);
    }
    private BuildTierCommands() {
        const tierlist = new Option(
            '-t, --tierlist <Tierlist Type>',
            "Need to specifiy a name with the -n flag.\n\
            Example '-t alpha -n Hotdogs'\n",
        );
        tierlist.choices(['alpha', 'num']);
        this.program.addOption(tierlist);
    }
    private HydrateCommands(message: Message) {
        this.program = new Command();
        this.program.name(message.client.user.username);
        this.program.description(`Currently all of the commands ${message.client.user.username} can do`);
        this.program.exitOverride();
        this.AsciiCommand();
        this.BuildTierCommands();
        this.NameCommand();
        this.ArtCommand();
        this.PlayCommand();
        this.MusicCommand();
        this.rollCommand();
        this.flipCommand();
    }
    public async handleCommand(message: Message) {
        this.HydrateCommands(message);
        if (message.channel.isThread() && message.channel.client.user.bot) {
            await this.tierListService.handleTierListCommand(message);
            return;
        }
        try {
            this.program.parse(message.content.split(' '), { from: 'user' });
        } catch (e) {
            await message.reply(this.program.helpInformation());
            return;
        }
        let options = this.program.opts();
        if (options.play !== undefined || options.music !== undefined) {
            if (!(await this.musicService.HandleMusic(message, options))) {
                message.reply(this.program.helpInformation());
            }
        }
        if (options.tierlist !== undefined && options.name !== undefined && this.CheckOps(options)) {
            await this.tierListService.startTierList(message, options);
            return;
        }
        if (options.ascii !== undefined && this.CheckOps(options)) {
            await this.asciiService.handleAsciiCommand(message, options);
            return;
        }
        if (options.flip !== undefined) {
            await message.reply('\n*' + this.flipService.FlipCoin() + '*');
            return;
        }
        if (options.roll !== undefined && !this.CheckIfMoreThanOneCommand(options)) {
            if (!(await this.rollService.handleRoll(message, options))) {
                await message.reply(this.program.helpInformation());
                return;
            }
            return;
        }
    }
    private CheckOps(options: OptionValues): boolean {
        if (options.tierlist !== undefined && options.ascii !== undefined) {
            return false;
        } else {
            return true;
        }
    }
    private CheckIfMoreThanOneCommand(option: OptionValues) {
        const str = JSON.stringify(option);
        const obj = JSON.parse(str) as Object;
        const keys = Object.keys(obj);
        if (keys.length > 1) {
            return true;
        }
        return false;
    }
}
