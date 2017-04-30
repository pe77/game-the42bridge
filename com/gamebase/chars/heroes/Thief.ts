module GameBase {
 
    export class Thief extends Hero {
        
        constructor(game:Pk.PkGame)
        {
            super(game, new Phaser.Rectangle(0, 0, 154, 163), 2);
 
            // energy type
            this.energyType     = E.EnergyType.STAMINA;

            // operator
            this.operator       = E.Operator.MINU;

            // name
            this.name = "Thief";

            // die turns
            this.dieTime = 4;

            // revive health
            this.reviveHealthPoints = 1;

            this.reloadEnergyQtn = 4;
        }

        create()
        {
            // add attacks
            var attack1:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(
                this.game, 
                this.operator, 
                this.energyType
            );
            attack1.energyCost = 2;
            attack1.value = 1;

            var attack2:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(
                this.game, 
                GameBase.E.Operator.PLUS, 
                this.energyType
            );
            attack2.energyCost = 4;
            attack2.value = 3;

            var attack3:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(
                this.game, 
                this.operator, 
                this.energyType
            );
            attack3.energyCost = 5;
            attack3.value = 15;

            this.addAttack(attack1);
            this.addAttack(attack3);
            this.addAttack(attack2);

            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char'+this.identification+'-idle'), 'iddle');
            // aniSprite.y+=18; // padding sprite adjust

            this.playAnimation('iddle', 16);
            this.currentAnimation.animation.frame = 10;

            super.create();
        }

    }
} 