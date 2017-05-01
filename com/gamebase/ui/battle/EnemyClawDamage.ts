
module GameBase {
 
    export class EnemyClawDamage extends Pk.PkElement {
        
        claw:Phaser.Sprite;

        enemy:GameBase.Enemy;
        hero:GameBase.Hero;

        animation:Phaser.Animation;


        constructor(game:Pk.PkGame, enemy:GameBase.Enemy, hero:GameBase.Hero)
        {
            super(game);

            this.hero = hero;
            this.enemy = enemy;

        }

        create()
        {
            this.claw = this.game.add.sprite(0, 0, 'monster-damage');
            
            this.animation = this.claw.animations.add('claw');


            this.add(this.claw)
            
			this.visible = false;
        }

        show()
        {
            this.visible = true;

            this.animation.play(15, false);
            this.animation.onComplete.add(()=>{
                this.event.dispatch(GameBase.E.EnemyClawDamage.OnEnd);
                this.destroy();
            }, this)
        }
    }

    export module E 
    {
        export module EnemyClawDamage
        {
            export const OnEnd:string 	= "OnEnemyClawDamageEnd";
        }
    }

} 