/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
 
module GameBase {
 
    export class Wolf extends GameBase.Enemy {
        
        constructor(game:Pk.PkGame)
        {
            // 76 - /2, -1, +5 = 42
            super(game, new Phaser.Rectangle(0, 0, 547, 344), 2, 76);

            // name
            this.name = "Wolf";

            this.level = 2;
        }

        create()
        {
            super.create();
            
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster'+this.identification+'-idle'), 'idle');
            aniSprite.y+=70; // padding sprite adjust
        }

    }
} 