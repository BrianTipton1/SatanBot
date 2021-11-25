import { injectable } from 'inversify';

@injectable()
export class FlipService {
    public FlipCoin(): string {
        return Math.round(Math.random()) + 1 == 1 ? 'Heads' : 'Tails';
    }
}
