/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
 
module GameBase {
 
    export class Hero extends GameBase.Char {
        
        ui:GameBase.ui.Hero;
        uiAttack:GameBase.ui.Attack;
        identification:number = 0;

        energyType:E.EnergyType = E.EnergyType.STAMINA;

        static heroes:Array<GameBase.Hero> = [];

        constructor(game, body, id)
        {
            super(game, body);
            this.ui = new GameBase.ui.Hero(this.game, this);
            this.uiAttack = new GameBase.ui.Attack(this.game, this);
            this.identification = id;

            GameBase.Hero.heroes.push(this);
        }

        create()
        {
            super.create();

            this.ui.create();
            this.uiAttack.create();

            this.body.events.onInputDown.add(()=>{

                // deselect all others
                GameBase.Hero.heroes.forEach(hero => {
                    if(hero.identification != this.identification)
                        hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
                    //
                });

                this.event.dispatch(GameBase.E.HeroEvent.OnHeroSelected);
            }, this);
        }

        setBody(body:Phaser.Sprite)
        {
            super.setBody(body);

            // mouse over check
            this.body.inputEnabled = true;
            this.body.input.useHandCursor = true;
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