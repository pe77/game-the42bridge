/// <reference path='../../pkframe/refs.ts' />

module GameBase {

    export class Gaude extends Pk.PkElement {

        valueMax: number;
        icons: Array<GameBase.GaudeIcon> = [];
        iconEven: boolean = true;

        padding: number = 3;

        addIcon(icon: GameBase.GaudeIcon, delay:number = 0): void {
            icon.create(false);

            // save icon ref
            this.icons.push(icon);

            // add on gaude
            this.add(icon);

            // organize icons pos
            for (var i = 0; i < this.icons.length; i++)
                this.icons[i].x = (this.icons[i].width + this.padding) * i;
            //

            icon.in(delay);

            this.valueMax = this.icons.length;
        }

        getVal():number
        {
            return this.icons.length;
        }

        // subtract value
        subVal(val:number) {

            // check
            if(!this.getVal())
                return;
            //

            val = val > this.getVal() ? this.getVal() : val;

            for (var i = 0; i < val; i++)
                this.icons.pop().out(i*180);
            //
            
        }

        // add value
        addVal(val:number) {

        }

    }
} 