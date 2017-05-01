
module GameBase {
 
    export class EndTurnButton extends Pk.PkElement {
        
        text:Phaser.Text;

        inOutTime:number = 500;
        showTime:number = 3000;

        buttonBack:Phaser.Sprite;

        tweenIn:Phaser.Tween;
        tweenOut:Phaser.Tween;

        create()
        {
			this.buttonBack = this.game.add.sprite(0, 0, 'endturn-button');

			this.text = this.game.add.text(0, 0,
				'End turn', // text
				{
					font: "40px StrangerBack",
					fill: "#202b3d"
				} // font style
			);

			this.text.anchor.x = 0.5;
			this.text.x = this.buttonBack.width / 2;
			this.text.y += 10;

			this.add(this.buttonBack);
			this.add(this.text);

			this.x = this.game.width - this.width - 20;
            this.y = this.game.height - this.height - 30;

            // set click event
            this.buttonBack.events.onInputDown.add(()=>{
                this.event.dispatch(GameBase.E.ButtonEvent.OnClick);
            });

            // this.buttonBack.events.onInputOut.dispatch();

            this.visible = false;
        }

        in()
        {
            this.visible = true;
            this.buttonBack.inputEnabled = true;

            this.alpha = 1;
            
            if(this.tweenOut)
                this.tweenOut.stop();
            //

            this.tweenIn = this.addTween(this).from(
                {
                    alpha:0
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.In,
                true
            );

            this.tweenIn.onComplete.add(()=>{
                this.alpha = 1;
                this.visible = true;
            }, this)
        }

        out()
        {
            // this.buttonBack.input.useHandCursor = false;
            this.buttonBack.inputEnabled = false;

            if(this.tweenIn)
                this.tweenIn.stop();
            //
            
            
            this.tweenOut = this.addTween(this).to(
                {
                    alpha:0
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.Out,
                true
            )

            this.tweenOut.onComplete.add(()=>{
                this.visible = false;
            }, this);
        }
    }

    export module E 
    {
        export module ButtonEvent
        {
            export const OnClick:string 	= "OnClick";
        }
    }

} 