/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='../base/Hero.ts' />
 
module GameBase {
 
    export class Devil extends GameBase.Enemy {
        
        constructor(game:Pk.PkGame)
        {
            // /4, -15, +5 = 42
            super(game, new Phaser.Rectangle(0, 0, 460, 516), 4, -9);

            // name
            this.name = "Devil";

            this.level = 4;
        }

        create()
        {
            super.create();
            
            // sprite set idle
            var aniSprite = this.addAnimation(this.game.add.sprite(0, 0, 'monster'+this.identification+'-idle'), 'iddle');
            // aniSprite.y+=71; // padding sprite adjust

            this.playAnimation('iddle', 10);
        }

    }
} 