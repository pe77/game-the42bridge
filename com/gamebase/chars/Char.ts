/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export class Char extends Pk.PkElement {
        
        operator:Operator;
        
        stamina:number;
        staminaMax:number;

        health:number;
        healthMax:number;

        body:Phaser.Sprite;

        side:Side = Side.RIGHT; // sprite side

        animationIdle:Phaser.Animation;

        constructor(game:Pk.PkGame, body:Phaser.Sprite)
        {
            super(game);

            this.setBody(body);

            this.animationIdle = this.body.animations.add('idle');
            this.animationIdle.play(10, true); // start idle animation
        }

        setBody(body:Phaser.Sprite):void
        {
            this.body = body;
            this.add(this.body);
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