
module GameBase {
 
    export class EndTurnAnimation extends Pk.PkElement {
        
        text:Phaser.Text;
        bg:Phaser.Sprite;

        create()
        {
            // bg bg! // same world size
            this.bg = Pk.PkUtils.createSquare(this.game, this.game.world.width, this.game.world.height, "#000")
            this.bg.alpha = .5;

            this.text = this.game.add.text(0, 0,
				"", // text
				{
					font: "161px StrangerBack",
					fill: "#fff"
				} // font style
			);

            this.text.anchor.set(.5, .5);
            this.text.x = this.game.world.centerX;
            this.text.y = this.game.world.centerY;

            this.add(this.bg);
            this.add(this.text);
            
			this.visible = false;
        }

        show(text:string = "End Turn")
        {
            this.text.text = text;
            this.visible = true;

            // show bg
            this.addTween(this.bg).from(
                {
                    alpha:0
                }, 
                100,
                Phaser.Easing.Linear.None,
                true
            )


            // show text
            this.addTween(this.text).from(
                {
                    x:this.text.x + 50,
                    alpha:0
                }, 
                200,
                Phaser.Easing.Cubic.In,
                true
            ).onComplete.add(()=>{

                // hide bg after delay
                this.addTween(this.bg).to(
                    {
                        alpha:0
                    }, 
                    100,
                    Phaser.Easing.Linear.None,
                    true,
                    1500
                )

                // hide text after delay
                this.addTween(this.text).to(
                    {
                        x:this.text.x - 50,
                        alpha:1
                    }, 
                    200,
                    Phaser.Easing.Cubic.In,
                    true,
                    1500
                ).onComplete.add(()=>{
                    this.event.dispatch(GameBase.E.EndTurnAnimation.OnEnd);
                    this.destroy();
                }, this);

            }, this);
        }
    }

    export module E 
    {
        export module EndTurnAnimation
        {
            export const OnEnd:string 	= "OnEndTurnAnimationEnd";
        }
    }

} 