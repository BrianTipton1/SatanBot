import { Command, OptionValues } from 'commander';
import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import Ascii from '../../domain/Ascii/ascii';
import AsciiRepository from '../../repositories/Ascii/asciiRepository';
import { TYPES } from '../../types';

@injectable()
export class AsciiService {
    private asciiRepo: AsciiRepository;
    constructor(@inject(TYPES.AsciiRepository) asciiRepo: AsciiRepository) {
        this.asciiRepo = asciiRepo;
    }
    private async CheckIfExists(name: string) {
        if ((await this.asciiRepo.GetAscii(name)).length !== 0) {
            return true;
        } else {
            return false;
        }
    }
    public async handleAsciiCommand(message: Message, options: OptionValues) {
        if (options.ascii == 'save' && options.value !== undefined && options.name !== undefined) {
            if (!(await this.CheckIfExists(options.name))) {
                const ascii: Ascii = {
                    art: options.value,
                    artName: options.name,
                    userName: message.author.username,
                    date: new Date(),
                };
                this.asciiRepo.CreateAscii(ascii);
                message.delete();
            }
            return;
        }
        if (options.ascii === 'post' && options.name !== undefined) {
            try {
                const resp = await this.asciiRepo.GetAscii(options.name);
                await message.channel.send(`<@${message.author.id}>\n` + '`' + resp[0].art + '`');
                await message.delete();
                return;
            } catch (error) {
                message.reply(
                    'There was no art found with that name, you can use --ascii list to see all the art currently saved',
                );
            }
        }
        if (options.ascii === 'delete' && options.name !== undefined) {
            if (options.name !== undefined) {
                this.asciiRepo.DeleteAscii(options.name);
            }
            return;
        }
        if (options.ascii == 'list') {
            const docs = await this.asciiRepo.GetAllArt();
            let names: Array<string> = [];
            let authors: Array<string> = [];
            for (let i = 0; i < docs.length; i++) {
                names.push(docs[i].artName);
                authors.push(docs[i].userName);
            }
            if (names.length !== 0) {
                let list = 'Here is the names of all the art!\n';
                for (let i = 0; i < names.length; i++) {
                    list += '- ' + names[i] + `  (Created By: ${authors[i]})\n`;
                }
                message.reply(list);
            } else {
                message.reply('There is no art saved currently :(');
            }
        }
    }
}
