/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
 
module GameBase {
 
    export class Hero extends GameBase.Char {
        
        healthGaude:GameBase.Gaude;
        energiGaude:GameBase.Gaude;

        gaudePadding:number = 5;

        energyType:E.EnergyType = E.EnergyType.STAMINA;

        create()
        {
            // gaudes
            this.healthGaude = new GameBase.Gaude(this.game);
            this.energiGaude = new GameBase.Gaude(this.game);

            // add on hero 
            this.add(this.healthGaude);
            this.add(this.energiGaude);

            // add heath icons
            for (var i = 0; i < this.healthMax; i++) 
                this.healthGaude.addIcon(new GameBase.Icon(this.game, 'heath-icon'));
            //

            // select energy icon
            var energyIconKey = '';
            switch (this.energyType) {
                case E.EnergyType.MANA:
                    energyIconKey = 'mana-icon';
                    break;

                case E.EnergyType.STAMINA:
                    energyIconKey = 'stamina-icon';
                    break;
            }

            // add energy icons
            for (var i = 0; i < this.energyMax; i++) 
                this.energiGaude.addIcon(new GameBase.Icon(this.game, energyIconKey));
            //

            // pos gaudes
            this.healthGaude.y = this.body.height + this.gaudePadding;
            this.energiGaude.y = this.healthGaude.y + (this.healthGaude.height / 4) + this.gaudePadding;
            this.energiGaude.x += this.gaudePadding;

            super.create();

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