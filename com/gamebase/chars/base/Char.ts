/// <reference path='../../../pkframe/refs.ts' />
 
module GameBase {
 
    export class Char extends Pk.PkElement implements GameBase.I.Selectable {
        
        operator:E.Operator;
        
        energy:number;
        energyMax:number = 5;

        health:number;
        healthMax:number = 5;

        body:Phaser.Sprite;

        side:Side = Side.RIGHT; // sprite side

        animationIdle:Phaser.Animation;
        animations:Array<GameBase.I.CharAnimations> = [];

        selected:boolean = false;
        selectedIcon:GameBase.SelectedIcon;

        attacks:Array<GameBase.Attack> = [];

        attackOpenDelay:number = 100;

        constructor(game:Pk.PkGame, body:Phaser.Rectangle)
        {
            super(game);

            var bodySprite:Phaser.Sprite = Pk.PkUtils.createSquare(game, body.width, body.height);
            bodySprite.alpha = .3;
            this.setBody(bodySprite);
        }

        addAnimation(sprite:Phaser.Sprite, animationKey:string, fps:number = 10):Phaser.Sprite
        {
            var a = sprite.animations.add(animationKey);
            a.play(fps, true);

            // this.body.addChild(sprite);
            this.add(sprite);

            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1;

            sprite.x = this.body.width / 2;
            sprite.y = this.body.height;// + 40;

            // sprite.anchor.set(.5, .5);

            //sprite.position = this.body.position; 
            

            // this.body.events.
            // sprite.y = this.body.y;

            this.animations.push({
                animation:a,
                sprite:sprite
            });

            return sprite;
        }

        create()
        {
            /*
            // animation
            this.animationIdle = this.body.animations.add('idle');
            this.animationIdle.play(10, true); // start idle animation
            */

            this.selectedIcon = new GameBase.SelectedIcon(this.game, this.body);
            this.selectedIcon.create();

            this.add(this.selectedIcon);
        }

        setBody(body:Phaser.Sprite):void
        {
            this.body = body;
            this.add(this.body);

            /*
            this.body.events.onInputOver.add(this.inputOver, this);
            this.body.events.onInputOut.add(this.inputOut, this);
            */
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

        addAttack(attack:GameBase.Attack)
        {
            // create attack
            attack.create();

            // add attack
            this.attacks.push(attack);
        }

        openAttacks()
        {
            for (var i = 0; i < this.attacks.length; i++) {
                var attack = this.attacks[i];
                
                // pos attacks
                attack.x = this.x + this.body.width/2;
                attack.y = this.y - attack.height;

                // last attack position
                if(i > 0)
                    attack.y = this.attacks[i-1].y - attack.height - this.attacks[i-1].energyTypeIcon.height - 50;    
                //

                // show
                attack.show(i*this.attackOpenDelay)
                
            }
        }
    }

    export module E
    {
        export enum Operator
        {
            MULT,
            DIVI,
            PLUS,
            MINU,
            FACT
        }
    }


    export module I
    {
        export interface CharAnimations
        {
            sprite:Phaser.Sprite;
            animation:Phaser.Animation;
        }
    }
    

    export enum Side
    {
        LEFT,
        RIGHT
    }
} 