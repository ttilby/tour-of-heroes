import { Player } from './player';
import { TickerService } from './ticker.service';
import { GLOBALS } from './globals';

const ACTION_METAVAR: string = "__X";

function randomChoice<T>(arr:Array<T>) : T {
    console.assert(arr.length > 0);
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

class ZoneActionDescription {
    present: string;
    past: string;
}

export class ZoneActionModel {
    constructor(
        public vb: string,
        public obj: string,
        public opts: string[],
        public skills: Object,
        public weight: number,
        public minDelay: number
    ) {}
    
    // Not idempotent because of randomness
    chooseDescription() : ZoneActionDescription {
        let predicate: string = this.descriptionPredicate();
        return {
            present: this.vb  + "ing " + predicate,
            past: this.vb + "ed " + predicate
        }
    }

    private descriptionPredicate() : string {
        let pred: string = this.obj;
        if (pred.indexOf(ACTION_METAVAR) != -1) {
            let sub = randomChoice(this.opts);
            pred = pred.replace(ACTION_METAVAR, sub);
        }
        return pred;
    }
        
}

export class ZoneAction {
    timer: number;
    startTime: number;
    duration: number;

    checkTimer: number;
    pctProgress: number = 0;
    description: ZoneActionDescription;
    constructor(
        public action: ZoneActionModel,
        public player: Player
    ){
        this.description = action.chooseDescription();
    }

    start(onCompletion: ()=>void) {
        this.duration = this.delay();
        this.startTime = new Date().getTime();
        this.timer = window.setTimeout(
            () => {
                this.effect();
                onCompletion();
            },
            this.duration
        );
        this.checkTimer = window.setInterval(
            () => {
                this.pctProgress = this.percentProgress();
            },
            GLOBALS.actionBarUpdateInterval 
        );
    }

    kill() {
        window.clearTimeout(this.timer);
        window.clearInterval(this.checkTimer);
    }

    percentProgress() : number {
        let now = new Date().getTime();
        return 100 * (now - this.startTime)/this.duration;
    }

    delay() : number {
        // TODO
        return this.action.minDelay;
    }

    effect() {
        // TODO
        this.player.level ++;
    }

    broadcast(ticker: TickerService) {
        // TODO
    }

}