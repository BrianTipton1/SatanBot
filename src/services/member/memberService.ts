import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import MemberStatusRepository from '../../repositories/Logging/member/memberStatusRepository';
import { GuildMember } from 'discord.js';
import MemberStatus from '../../domain/Logging/members/memberStatus';

@injectable()
export class MemberService {
    private memberStatusRepo: MemberStatusRepository;
    constructor(@inject(TYPES.MemberStatusRepository) MemberStatusRepository: MemberStatusRepository) {
        this.memberStatusRepo = MemberStatusRepository;
    }
    public async handleMemberStatus(member: GuildMember) {
        const status: MemberStatus = {
            userName: member.user.username,
            userId: member.user.id,
            date: new Date(),
            joined: member.deleted,
            left: !member.deleted,
        };
        this.memberStatusRepo.CreateLog(status);
    }
}
