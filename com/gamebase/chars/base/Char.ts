/// <reference path='../../../pkframe/refs.ts' />
 
module GameBase {
 
    export class Char extends Pk.PkElement implements GameBase.I.Selectable {
        
        operator:E.Operator;
        
        energy:number;
        energyMax:number = 5;

        health:number;
        healthMax:number = 5;

        body:Phaser.Sprite;

        turnMove:boolean = false;

        side:Side = Side.RIGHT; // sprite side

        animationIdle:Phaser.Animation;
        currentAnimation:GameBase.I.CharAnimations;
        animations:Array<GameBase.I.CharAnimations> = [];

        selected:boolean = false;
        selectedIcon:GameBase.SelectedIcon;

        attacks:Array<GameBase.Attack> = [];

        attackOpenDelay:number = 100;

        saturationFilter:Phaser.Filter;
        

        constructor(game:Pk.PkGame, body:Phaser.Rectangle)
        {
            super(game);

            var bodySprite:Phaser.Sprite = Pk.PkUtils.createSquare(game, body.width, body.height);
            bodySprite.alpha = .0;
            this.setBody(bodySprite);


            // saturation filter
            this.saturationFilter = this.game.add.filter('Gray');
            this.saturationFilter.uniforms.gray.value = 0.0; // default: no filter intensit 
        }

        addAnimation(sprite:Phaser.Sprite, animationKey:string, fps:number = 10):Phaser.Sprite
        {
            var a = sprite.animations.add(animationKey);

            // this.body.addChild(sprite);
            this.add(sprite);

            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1;

            sprite.x = this.body.width / 2;
            sprite.y = this.body.height;// + 40; 

            // add saturation filter
            // sprite.filters = [this.saturationFilter];

            this.animations.push({
                animation:a,
                sprite:sprite
            });

            if(!this.currentAnimation)
            {
                this.currentAnimation = this.animations[0];
            }
            

            return sprite;
        }

        playAnimation(key:string, fps:number = 10, loop:boolean = true)
        {
            this.animations.forEach(element => {
                element.animation.stop();
                element.sprite.alpha = 0;
                
                if(element.animation.name == key)
                {
                    element.animation.play(fps, loop);
                    // element.animation.restart();
                    element.sprite.alpha = 1;

                    this.currentAnimation = element;
                    
                }
            });
        }

        create()
        {
            this.selectedIcon = new GameBase.SelectedIcon(this.game, this.body);
            this.selectedIcon.create();

            this.add(this.selectedIcon);

            

        }

        setBody(body:Phaser.Sprite):void
        {
            this.body = body;
            this.add(this.body);
        }

        addAttack(attack:GameBase.Attack)
        {
            // add attack
            this.attacks.push(attack);
        }

        setTurnMove(v:boolean)
        {
            this.turnMove = v;
            this.event.dispatch(GameBase.E.CharEvent.OnCharTurnMove, this.turnMove);
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

        export module CharEvent
        {
            export const OnCharTurnMove:string 	= "OnCharTurnMove";
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