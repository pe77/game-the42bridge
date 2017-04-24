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
            this.dieTime = 2;

            // revive health
            this.reviveHealthPoints = 3;
        }

        create()
        {
            // add attacks
            var attack1:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack1.energyCost = 2;
            attack1.value = 1;

            this.addAttack(attack1);
            
            var attack2:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack2.energyCost = 3;
            attack2.value = 5;

            this.addAttack(attack2);

            var attack3:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(this.game, this.operator, this.energyType);
            attack3.energyCost = 5;
            attack3.value = 15;

            this.addAttack(attack3);

            super.create();
            
            // animation
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'char'+this.identification+'-idle'), 'iddle');
            // aniSprite.y+=28; // padding sprite adjust

            this.playAnimation('iddle', 10);
        }

    }
} 