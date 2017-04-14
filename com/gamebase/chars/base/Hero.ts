/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
 
module GameBase {
 
    export class Hero extends GameBase.Char {
        
        ui:GameBase.ui.Hero;
        identification:number = 0;

        energyType:E.EnergyType = E.EnergyType.STAMINA;

        static heroes:Array<GameBase.Hero> = [];

        constructor(game, body, id)
        {
            super(game, body);
            this.ui = new GameBase.ui.Hero(this.game, this);
            this.identification = id;

            GameBase.Hero.heroes.push(this);
        }

        create()
        {
            // create ui
            this.ui.create();

            super.create();

            this.add(this.ui);

            this.body.events.onInputDown.add(()=>{

                // deselect all others
                GameBase.Hero.heroes.forEach(hero => {
                    if(hero.identification != this.identification)
                        hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
                    //
                });

                // this.openAttacks();
                this.event.dispatch(GameBase.E.HeroEvent.OnHeroSelected);
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

        export module HeroEvent
        {
            export const OnHeroSelected:string 	= "OnHeroSelected";
            export const OnHeroDeselect:string 	= "OnHeroDeselect";
        }
    }
} 