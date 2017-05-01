/// <reference path='../pkframe/refs.ts' />
 
module GameBase {
 
    export class IntroBox extends Pk.PkElement {
        
        image:Phaser.Sprite;
        time:number;

        constructor(game:Pk.PkGame, image:Phaser.Sprite, time:number = 5000)
        {
            super(game);

            // set img
            this.image = image;
            this.time = time;
            
            this.image.anchor.x = .5;
            this.image.x = this.game.world.centerX;
            
            // add objs
            this.add(this.image);

            // "display none"
            this.alpha = 0;
        }

        in(delay:number = 1500)
        {
            // anim block
            
            this.addTween(this).to(
                {
                    alpha: 1
                }, // props
                500, // animation time
                Phaser.Easing.Linear.None, // tween
                true, // auto start
                delay // delay 
            )

            setTimeout(()=>{
                this.event.dispatch(GameBase.E.IntroBoxEvent.OnIntroBoxEnd);
            }, this.time)
        }

        out(delay:number = 0)
        {
            // anim block
            var outTween = this.addTween(this).to(
                {
                    alpha: 0
                }, // props
                500, // animation time
                Phaser.Easing.Linear.None, // tween
                false, // auto start
                delay // delay 
            );

            // remove when anim out complete
            outTween.onComplete.add(()=>{
                this.destroy();
            }, this);

            outTween.start();
        }
    }

    export module E
    {
        export module IntroBoxEvent
        {
            export const OnIntroBoxEnd:string = "OnIntroBoxEnd";
        }

        export enum IntroBoxDirection
        {
            LEFT,
            RIGHT
        }
    }


} 