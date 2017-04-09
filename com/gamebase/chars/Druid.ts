/// <reference path='../../pkframe/refs.ts' />
/// <reference path='./base/Hero.ts' />
 
module GameBase {
 
    export class Druid extends Hero {
        
        constructor(game:Pk.PkGame)
        {
            super(game, game.add.sprite(0, 0, 'char1'));

            // energy type
            this.energyType     = E.EnergyType.MANA;

            // operator
            this.operator       = E.Operator.MULT;
        }

        create()
        {
            super.create();

            // add attacks
            this.addAttack( // regular
                new GameBase.Attacks.Regular(this.game, this.operator, this.energyType)
            );

            // custom regular 1
            var regularAttackCustom:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(this.game, E.Operator.PLUS, this.energyType);
            regularAttackCustom.name = "Custom Regular Attack 1";
            regularAttackCustom.description = "Short description";
            regularAttackCustom.energyCost = 3;
            regularAttackCustom.value = 6;
            regularAttackCustom.icon = new GameBase.Icon(this.game, 'attack-icon-beast'); 

            this.addAttack(regularAttackCustom);
            
            // custom regular 2
            var regularAttackCustom2:GameBase.Attacks.Regular = new GameBase.Attacks.Regular(this.game, E.Operator.DIVI, this.energyType);
            regularAttackCustom2.name = "Custom  Regular Attack 2";
            regularAttackCustom2.description = "Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, \nsed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            regularAttackCustom2.icon = new GameBase.Icon(this.game, 'attack-icon-tree'); 
            regularAttackCustom2.energyCost = 5;
            regularAttackCustom2.value = 3;

            
            this.addAttack(regularAttackCustom2);
            

        }

    }
} 