/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
 
module GameBase {
 
    export class Wolf extends GameBase.Enemy {
        
        constructor(game:Pk.PkGame)
        {
            super(game, new Phaser.Rectangle(0, 0, 561, 366), 2, 22);

            // name
            this.name = "Wolf";

            this.level = 2;
        }

        create()
        {
            super.create();
            
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster'+this.identification+'-idle'), 'iddle');
            this.playAnimation('iddle', 15);

            aniSprite.y+=10; // padding sprite adjust
        }

    }
} 