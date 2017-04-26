 
module GameBase {
 
    export class AttributeChange extends Pk.PkElement {
        
        
        value:number;
        target:GameBase.Hero;
        type:GameBase.E.AttributeType;

        icon:Phaser.Sprite;

        text:Phaser.Text;

        sum:boolean = true;

        constructor(game:Pk.PkGame, target:GameBase.Hero, value:number, type:GameBase.E.AttributeType, sum:boolean)
        {
            super(game);
            this.value      = value;
            this.type       = type;
            this.target     = target;
            this.sum        = sum;
        }

        create()
        {
            var iconKeyType:string = 'stamina';

            switch(this.type)
            {
                case GameBase.E.AttributeType.HEALTH:
                    iconKeyType = 'health';
                    break;

                case GameBase.E.AttributeType.STAMINA:
                    iconKeyType = 'stamina';
                    break;

                case GameBase.E.AttributeType.MANA:
                    iconKeyType = 'mana';
                    break;
            }

            this.icon = this.game.add.sprite(0, 0, iconKeyType+'-icon-large');
            this.icon.alpha = 0.7;
            
            var operator:string = this.sum ? '+' : '-';

            this.text = this.game.add.text(0, 0,
				operator + '' + this.value,
				{
					font: "42px StrangerBack",
					fill: "#fff"
				} // font style
			);
            this.text.setShadow(3, 3, 'rgba(0,0,0,0.9)', 2);

            this.add(this.icon);
            this.add(this.text);

            this.text.anchor.x = 0.5;
            this.text.x = this.icon.width / 2;
            this.text.y = 0; 

            // pos
            this.x = this.target.ui.x + this.target.body.width / 2;
            this.y = this.target.ui.y - this.target.ui.height;

            this.visible = false;
        }

        show()
        {
            this.visible = true;

            var tweenIn:Phaser.Tween = this.addTween(this).from(
                {
                    y:this.y + 30,
                    alpha:0
                }, 
                300,
                Phaser.Easing.Back.In,
                true
            );

            tweenIn.onComplete.add(()=>{
                
                var tweenOut:Phaser.Tween = this.addTween(this).to(
                    {
                        y:this.y - 30,
                        alpha:0
                    }, 
                    300,
                    Phaser.Easing.Back.Out,
                    true,
                    1500
                );

                tweenOut.onComplete.add(()=>{
                    this.destroy();
                }, this);

            }, this);

        }

    }
} 