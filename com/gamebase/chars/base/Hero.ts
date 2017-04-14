/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
 
module GameBase {
 
    export class Hero extends GameBase.Char {
        
        ui:GameBase.ui.Hero;
        identification:number = 0;

        energyType:E.EnergyType = E.EnergyType.STAMINA;

        constructor(game, body, id)
        {
            super(game, body);
            this.ui = new GameBase.ui.Hero(this.game, this);
            this.identification = id;
        }

        create()
        {
            // create ui
            this.ui.create();

            super.create();

            this.add(this.ui);

            this.body.events.onInputDown.add(()=>{
                this.openAttacks();
            }, this);

        }

    }

    export module E
    {
        export enum EnergyType
        {
            STAMINA,
            MANA
        }
    }
} 