module GameBase {
 
    export class Knight extends Hero {
        
        constructor(game:Pk.PkGame)
        {
            super(game, new Phaser.Rectangle(0, 0, 184, 189), 4);

            // energy type
            this.energyType     = E.EnergyType.STAMINA;

            // operator
            this.operator       = E.Operator.PLUS;

            // name
            this.name = "Knight";

            // die turns
            this.dieTime = 1;

            // revive health
            this.reviveHealthPoints = 4;

            this.damageReduction = 3;

            this.reloadEnergyQtn = 2;
        }

        create()
        {
            // add attacks
            var attack1:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(
                this.game, 
                this.operator, 
                this.energyType
            );
            attack1.energyCost = 1;
            attack1.value = 1;

            var attack2:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(
                this.game, 
                this.operator, 
                this.energyType
            );
            attack2.energyCost = 3;
            attack2.value = 5;

            var attack3:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(
                this.game, 
                this.operator, 
                this.energyType
            );
            attack3.energyCost = 5;
            attack3.value = 13;

            this.addAttack(attack1);
            this.addAttack(attack3);
            this.addAttack(attack2);

            // animation
            // iddle
            var iddleSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char'+this.identification+'-idle'), 'iddle');
            iddleSprite.y+=18; // padding sprite adjust

            // dead
            var deadSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char'+this.identification+'-dead'), 'dead');
            // deadSprite.width = this.body.width;
            // deadSprite.y+=20;

            this.playAnimation('iddle', 12);
            this.currentAnimation.animation.frame = 6;

            super.create();
        }

    }
} 