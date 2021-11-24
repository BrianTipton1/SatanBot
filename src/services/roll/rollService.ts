import { OptionValues } from 'commander';
import { Message } from 'discord.js';
import { injectable } from 'inversify';

@injectable()
export class RollService {
    private parseRoll(roll: string) {
        let nums = roll.split('-');
        if (roll === 'default') {
            return Math.floor(Math.random() * (100 - 1 + 1) + 1);
        }
        if (nums.length !== 2) {
            return false;
        }
        if (!(parseInt(nums[0]) || parseInt(nums[1]))) {
            return false;
        }
        return Math.floor(Math.random() * (parseInt(nums[1]) - parseInt(nums[0]) + 1) + parseInt(nums[0]));
    }
    public handleRoll(message: Message, options: OptionValues) {
        if (!this.parseRoll(options.roll)) {
            return false;
        }
        message.reply(`<@${message.author.id}> rolled ` + this.parseRoll(options.roll).toString() + '!');
        return true;
    }
}
