import { Message, ThreadChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { AsciiService } from '../ascii/asciiService';
import { TierListService } from '../tierlist/tierlistService';
import { Argument, Command, CommanderError, Option, OptionValues } from 'commander';
@injectable()
export class CommandService {
    private tierListService: TierListService;
    private asciiService: AsciiService;
    private program: Command;
    constructor(
        @inject(TYPES.TierListService) tierListService: TierListService,
        @inject(TYPES.AsciiService) asciiService: AsciiService,
    ) {
        this.tierListService = tierListService;
        this.asciiService = asciiService;
    }
    private NameCommand() {
        const name = new Option('-n, --name <Name of Item>').hideHelp();
        this.program.addOption(name);
    }
    private ArtCommand() {
        const art = new Option('-v, --value <Ascii Art to be saved>').hideHelp();
        this.program.addOption(art);
    }
    private AsciiCommand() {
        const ascii = new Option(
            '-a, --ascii <Action to preform>',
            "Need to specifiy a name with the -n flag and art with -v flag.\n \
            Example: '-a post -n Chungus -v INSERT-ASCII-HERE\n",
        );
        ascii.choices(['save', 'delete', 'post', 'list']);
        this.program.addOption(ascii);
    }
    private BuildTierCommands() {
        const tierlist = new Option(
            '-t, --tierlist <Tierlist Type>',
            "Need to specifiy a name with the -n flag. Example '-t alpha -n Hotdogs'\n",
        );
        tierlist.choices(['alpha', 'num']);
        this.program.addOption(tierlist);
    }
    private HydrateCommands(message: Message) {
        this.program = new Command();
        this.program.name(message.client.user.username);
        this.program.description('Currently all of the bot commands available on this server');
        this.program.exitOverride();
        this.AsciiCommand();
        this.BuildTierCommands();
        this.NameCommand();
        this.ArtCommand();
    }
    public async handleCommand(message: Message) {
        this.HydrateCommands(message);
        if (message.channel.isThread() && message.channel.client.user.bot) {
            this.tierListService.handleTierListCommand(message);
            return;
        }
        try {
            this.program.parse(message.content.split(' '), { from: 'user' });
        } catch (e) {
            message.reply(this.program.helpInformation());
        }
        let options = this.program.opts();
        if (options.tierlist !== undefined && options.name !== undefined && this.CheckOps(options)) {
            this.tierListService.startTierList(message, options);
            return;
        }
        if (options.ascii !== undefined && this.CheckOps(options)) {
            this.asciiService.handleAsciiCommand(message, options);
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
}
