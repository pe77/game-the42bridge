
module GameBase {
 
    export class SpeakHero extends Pk.PkElement {
        
        text:Phaser.Text;
        bg:Phaser.Sprite;

        hero:GameBase.Hero;

        constructor(game:Pk.PkGame, hero:GameBase.Hero)
        {
            super(game);

            this.hero = hero;
        }

        create()
        {
            // bg bg! // same world size
            this.bg = this.game.add.sprite(0, 0, 'speak-' + this.game.rnd.integerInRange(1, 5));

            // pos on hero head
            // this.bg.anchor.set(0.5, .5);
            /*
            this.bg.anchor.x = 0.5;
            this.bg.anchor.y = 1;
            this.bg.x = this.hero.body.x //;+ this.bg.width;
            this.bg.y = this.hero.body.y;
            */

            this.add(this.bg);
			this.visible = false;

            // Pk.PkState.currentState.addToLayer('ui', this);

            // pos
        }

        show()
        {
            // pos
            this.bg.x = this.hero.x;
            this.bg.y = this.hero.y - this.height;

            this.visible = true;

            // show bg
            this.addTween(this.bg).from(
                {
                    alpha:0,
                    y:this.bg.y+10,
                    rotation:this.rotation - 0.1
                }, 
                200,
                Phaser.Easing.Back.In,
                true
            ).onComplete.add(()=>{

                this.addTween(this.bg).to(
                    {
                        alpha:0,
                        y:this.bg.y-10
                    }, 
                    200,
                    Phaser.Easing.Linear.None,
                    true,
                    2500
                ).onComplete.add(()=>{
                    this.destroy();
                })
                
            }, this);


        }
    }

    export module E 
    {
        export module SpeakHeroEvent
        {
            export const OnEnd:string 	= "SpeakHeroEventEnd";
        }
    }

} 