/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
 
module GameBase {
 
    export class Enemy extends GameBase.Char {
        
        ui:GameBase.ui.Enemy;
        identification:number = 0;
        value:number = 0;

        static enemies:Array<GameBase.Enemy> = [];

        constructor(game, body, id, value)
        {
            super(game, body);
            this.ui = new GameBase.ui.Enemy(this.game, this);
            this.identification = id;
            this.value = value;

            GameBase.Enemy.enemies.push(this);
        }

        create()
        {
            super.create();
            this.ui.create();
        }

    }

    export module E
    {
        export module EnemyEvent
        {
            export const OnHeroSelected:string 	= "OnHeroSelected";
            export const OnHeroDeselect:string 	= "OnHeroDeselect";
        }
    }
} 