/// <reference path='../../pkframe/refs.ts' />
/// <reference path='./base/Attack.ts' />
 
module GameBase {
 
    export module Attacks
    {
        export class Regular extends GameBase.Attack
        {
            constructor(game:Pk.PkGame, operator:E.Operator, energyType:E.EnergyType)
            {
                super(
                    game, 
                    5, 
                    2, 
                    operator,
                    energyType,
                    "Regular Attack", 
                    "Attack description. Bla Bla Bla Bla", 
                    new GameBase.Icon(game, 'attack-icon-regular')
                );

            }

            create()
            {
                super.create();
            }
        }
    }
} 