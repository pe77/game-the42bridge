/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export class Char extends Pk.PkElement implements GameBase.I.Selectable {
        
        operator:Operator;
        
        energy:number;
        energyMax:number = 5;

        health:number;
        healthMax:number = 5;

        body:Phaser.Sprite;

        side:Side = Side.RIGHT; // sprite side

        animationIdle:Phaser.Animation;

        selected:boolean = false;
        selectedIcon:GameBase.SelectedIcon;

        constructor(game:Pk.PkGame, body:Phaser.Sprite)
        {
            super(game);

            this.setBody(body);
        }

        create()
        {
            // animation
            this.animationIdle = this.body.animations.add('idle');
            this.animationIdle.play(10, true); // start idle animation

            this.selectedIcon = new GameBase.SelectedIcon(this.game, this);
            this.selectedIcon.create();

            this.add(this.selectedIcon);
        }

        setBody(body:Phaser.Sprite):void
        {
            this.body = body;
            this.add(this.body);

            // mouse over check
            this.body.inputEnabled = true;
            this.body.input.useHandCursor = true;
            this.body.events.onInputOver.add(this.inputOver, this);
            this.body.events.onInputOut.add(this.inputOut, this);
        }

        private inputOver()
        {
            this.selectedIcon.in();
            this.selected = true;
        }

        private inputOut()
        {
            this.selectedIcon.out();
            this.selected = false;
        }
    }

    export enum Operator
    {
        MULT,
        DIVI,
        PLUS,
        MINU,
        FACT
    }

    export enum Side
    {
        LEFT,
        RIGHT
    }
} 