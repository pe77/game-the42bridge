/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export class Icon extends Pk.PkElement {
        
        iconKey:string;
        inOutTime:number = 500;

        animation:Phaser.Animation;
        body:Phaser.Sprite;

        constructor(game:Pk.PkGame, iconKey:string)
        {
            super(game);

            this.iconKey = iconKey;

            
        }

        create()
        {
            this.body = this.game.add.sprite(0, 0, this.iconKey);
            this.add(this.body);

            // animation
            this.animation = this.body.animations.add('pulse');
            // this.animation.play(3, true); // start pulse animation

            this.in();
        }

        in()
        {
            this.addTween(this).from(
                {
                    alpha:0
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.In,
                true
            )
        }

        out()
        {
            this.addTween(this).to(
                {
                    alpha:0
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.In,
                true
            )
        }

    }
} 