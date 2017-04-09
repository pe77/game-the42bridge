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

        create(startShow:boolean = true)
        {
            this.body = this.game.add.sprite(0, 0, this.iconKey);
            this.add(this.body);

            if(startShow)
                this.in();
            //
        }

        playAnimation(frameRate)
        {
            // default Values

            // animation
            this.animation = this.body.animations.add('pulse');
            this.animation.play(frameRate, true); // start pulse animation
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
                Phaser.Easing.Back.Out,
                true
            )
        }

    }
} 