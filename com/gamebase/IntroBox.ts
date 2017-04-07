/// <reference path='../pkframe/refs.ts' />
 
module GameBase {
 
    export class IntroBox extends Pk.PkElement {
        
        image:Phaser.Sprite;
        text:Phaser.Text;
        padding:number = 20;
        textStyle:any = {
                    // font details
					font: "25px Arial",
					fill: "#fff", 
					boundsAlignH: "center", 
                    boundsAlignV: "top",
                    wordWrap: true,
                    wordWrapWidth: 250
		}

        constructor(game:Pk.PkGame, image:Phaser.Sprite, text:string)
        {
            super(game);

            // set img
            this.image = image;
            
            // text.w = image.w
            this.textStyle.wordWrapWidth = this.image.width + 100;

            // create text object
            this.text = this.game.add.text(0, 0, text, this.textStyle);
            this.text.align = "center";

            // style details
            this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            
            // pos
            this.text.y += this.image.height + this.padding;

            this.text.width;
            console.log('this.text.width:', this.text.width)

            this.image.anchor.x = .5;
            this.image.x = this.text.width / 2;
            
            // add objs
            this.add(this.text);
            this.add(this.image);

            // "display none"
            this.alpha = 0;
        }

        in(delay:number = 1500)
        {
            // anim block
            this.game.add.tween(this).to(
                {
                    alpha: 1
                }, // props
                500, // animation time
                Phaser.Easing.Linear.None, // tween
                true, // auto start
                delay // delay 
            )
        }

        out(delay:number = 0)
        {
            // anim block
            var outTween = this.game.add.tween(this).to(
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
        export enum IntroBoxDirection
        {
            LEFT,
            RIGHT
        }
    }


} 