
module GameBase {
 
    export class LevelFlag extends Pk.PkElement {
        
        level:GameBase.Attack;

        flagText:Phaser.Text;

        inOutTime:number = 500;
        showTime:number = 5000;

        create()
        {
			var flagSprite:Phaser.Sprite = this.game.add.sprite(0, 0, 'level-flag');

			this.flagText = this.game.add.text(0, 0,
				'Chapter X', // text
				{
					font: "52px StrangerBack",
					fill: "#e5d4c5"
				} // font style
			);

			this.flagText.anchor.x = 0.5;
			this.flagText.x = flagSprite.width / 2;
			this.flagText.y += 35;

			this.add(flagSprite);
			this.add(this.flagText);

			this.x = this.game.width / 2 - this.width / 2;
            this.y -= 10;

            // this.fixedToCamera = true;

            this.visible = false;
			
        }

        show(level:number)        
        {
            this.addTween(this).from(
                {
                    y:this.height*(-1)
                }, 
                this.inOutTime,
                Phaser.Easing.Back.Out,
                true
            );

            this.flagText.text = 'Chapter ' + level;
            this.visible = true;

            setTimeout(()=>{
                var tween = this.addTween(this).to(
                    {
                        y:this.height*(-1)
                    }, 
                    this.inOutTime,
                    Phaser.Easing.Back.In,
                    false
                );

                tween.onComplete.add(()=>{
                    this.event.dispatch(GameBase.E.LevelFlagEvent.OnEndShow);
                }, this);

                tween.start();
            }, this.showTime - this.inOutTime);
        }
    }

    export module E 
    {
        export module LevelFlagEvent
        {
            export const OnEndShow:string 	= "OnEndShow";
        }
    }

} 