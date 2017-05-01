 
module GameBase {
 
    export module ui
    {
        export class ReviveAura extends Pk.PkElement {
            
            
            target:GameBase.Hero;

            aura:Phaser.Sprite;
            initialPosition:Phaser.Point;

            sound:Phaser.Sound;

            constructor(game:Pk.PkGame, target:GameBase.Hero)
            {
                super(game);
                this.target     = target;
            }

            create()
            {
                this.aura = this.game.add.sprite(0, 0, 'ui-hero-revive');

                // this.text.setShadow(3, 3, 'rgba(0,0,0,0.9)', 2);
                // pos
                this.aura.anchor.x = 0.5;
                this.aura.x = this.target.x + this.target.body.width / 2;

                // add
                this.add(this.aura);

                // defaults
                this.visible = false;

                this.sound = this.game.add.audio('a-hero-res');
            }


            show()
            {
                this.visible = true;

                this.alpha = 0;

                this.sound.play('', 0, 0.3)
                var tween = this.addTween(this).to(
                    {
                        alpha:1
                    }, 
                    200,
                    Phaser.Easing.Linear.None,
                    true
                ).onComplete.add(()=>{
                    this.addTween(this).to(
                        {
                            alpha:0
                        }, 
                        200,
                        Phaser.Easing.Linear.None,
                        true,
                        1000
                    ).onComplete.add(()=>{
                        console.log('end')
                        this.destroy();
                    }, this);
                }, this);

            }

        }
    }
} 