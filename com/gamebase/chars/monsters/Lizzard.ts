/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
 
module GameBase {
 
    export class Lizzard extends GameBase.Enemy {
        
        constructor(game:Pk.PkGame)
        {
            super(game, new Phaser.Rectangle(0, 0, 273, 372), 1, 93);

            // name
            this.name = "Lizzard";

            this.level = 5;
        }

        create()
        {
            super.create();
            
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster'+this.identification+'-idle'), 'idle');
            aniSprite.y+=69; // padding sprite adjust
        }

    }
} 