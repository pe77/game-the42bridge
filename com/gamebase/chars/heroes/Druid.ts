/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
 
module GameBase {
 
    export class Druid extends Hero {
        
        constructor(game:Pk.PkGame)
        {
            super(game, new Phaser.Rectangle(0, 0,150, 249), 1);

            // energy type
            this.energyType     = E.EnergyType.MANA;

            // operator
            this.operator       = E.Operator.MULT;

            // name
            this.name = "Druid";

            // die turns
            this.dieTime = 8;

            // revive health
            this.reviveHealthPoints = 3;

            this.reloadEnergyQtn = 3;
        }

        create()
        {
            

            // add attacks
            var attack1:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 2;
            attack1.value = 2;

            
            
            var attack2:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(
                this.game, 
                GameBase.E.Operator.MINU, 
                this.energyType
            );
            attack2.energyCost = 4;
            attack2.value = 2;

            var attack3:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 3;


            this.addAttack(attack1);
            this.addAttack(attack3);
            this.addAttack(attack2);

            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char'+this.identification+'-idle'), 'iddle');
            // aniSprite.y+=26; // padding sprite adjust

            this.playAnimation('iddle', 11);
            this.currentAnimation.animation.frame = 2;

            super.create();
        }

    }
} 