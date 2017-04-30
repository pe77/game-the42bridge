/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
 
module GameBase {
 
    export class Ghost extends GameBase.Enemy {
        
        constructor(game:Pk.PkGame)
        {
            super(game, new Phaser.Rectangle(0, 0, 215, 383), 3, 76);

            // name
            this.name = "Ghost";

            this.level = 3;
        }

        create()
        {
            super.create();
            
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster'+this.identification+'-idle'), 'iddle');
            // aniSprite.y+=102; // padding sprite adjust

            this.playAnimation('iddle', 10);
        }

    }
} 