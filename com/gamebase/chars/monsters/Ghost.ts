/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
 
module GameBase {
 
    export class Ghost extends GameBase.Enemy {
        
        constructor(game:Pk.PkGame)
        {
            super(game, new Phaser.Rectangle(0, 0, 220, 371), 3, 73);

            // name
            this.name = "Ghost";

            this.level = 3;
        }

        create()
        {
            super.create();
            
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster'+this.identification+'-idle'), 'idle');
            aniSprite.y+=102; // padding sprite adjust
        }

    }
} 