 
module GameBase {
 
    export module ui
    {
        export class DeadCount extends Pk.PkElement {
            
            
            target:GameBase.Hero;

            icon:Phaser.Sprite;
            text:Phaser.Text;

            initialPosition:Phaser.Point;

            constructor(game:Pk.PkGame, target:GameBase.Hero)
            {
                super(game);
                this.target     = target;
            }

            create()
            {
                this.icon = this.game.add.sprite(0, 0, 'ui-hero-dead-count');

                this.text = this.game.add.text(0, 0,
                    '0',
                    {
                        font: "46px StrangerBack",
                        fill: "#4d4e50",
                        fontWeight:'bold'
                    } // font style
                );
                // this.text.setShadow(3, 3, 'rgba(0,0,0,0.9)', 2);


                // pos
                this.icon.anchor.x = 0.5;
                this.icon.x = this.target.body.width / 2;

                this.text.x = this.icon.x + 4;
                this.text.y += 4;

                // fix initial pos
                this.setAsInitialCords()
                
                // add
                this.add(this.icon);
                this.add(this.text);

                // events
                this.target.event.add(GameBase.E.HeroEvent.OnHeroDieResolve, this.updateValue, this)

                // defaults
                this.visible = false;
            }

            setAsInitialCords()
            {
                this.initialPosition = new Phaser.Point(this.x, this.y);
            }

            resetAttrs()
            {
                this.alpha = 1;
                this.x = this.initialPosition.x;
                this.y = this.initialPosition.y;
            }

            updateValue()
            {
                // update value
                this.text.text = (this.target.dieWaiting + 0).toString();

                this.addTween(this).from(
                    {
                        y:this.y - 30
                    }, 
                    300,
                    Phaser.Easing.Elastic.Out,
                    true
                ).onComplete.add(()=>{
                    
                }, this);
            }

            show()
            {
                // set dead count
                this.text.text = (this.target.dieWaiting + 0).toString();

                this.resetAttrs();
                this.visible = true;

                this.alpha = 1;
                var tweenIn:Phaser.Tween = this.addTween(this).from(
                    {
                        y:this.y + 30,
                        alpha:0
                    }, 
                    300,
                    Phaser.Easing.Back.In,
                    true
                );

            }

            hide()
            {
                this.resetAttrs();
                this.visible = true;

                var tweenOut:Phaser.Tween = this.addTween(this).to(
                    {
                        alpha:0,
                        y:-30
                    }, 
                    100,
                    Phaser.Easing.Back.Out,
                    true
                );

            }
        }
    }
} 