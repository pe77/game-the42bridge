/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export class SelectedIcon extends Pk.PkElement {
        
        iconKey:string;
        inOutTime:number = 200;

        animation:Phaser.Animation;
        target:Phaser.Sprite;

        topIcons:Phaser.Group;
        botIcons:Phaser.Group;

        padding:number = 10;

        initialPosTop:Phaser.Point;
        initialPosBot:Phaser.Point;

        constructor(game:Pk.PkGame, target:Phaser.Sprite)
        {
            super(game);
            this.target = target;
        }

        create()
        {
            // get create 4 squares | 2 top, 2 down
            this.topIcons = this.game.add.group();
            this.botIcons = this.game.add.group();

            return;

            // create
            var topLeft     = this.game.add.sprite(0, 0, 'selected-icon');
            var topRight    = this.game.add.sprite(0, 0, 'selected-icon');
            var botLeft     = this.game.add.sprite(0, 0, 'selected-icon');
            var botRight    = this.game.add.sprite(0, 0, 'selected-icon');

            // animation
            topLeft.animations.add('pulse').play(10, true);
            topRight.animations.add('pulse').play(10, true);
            botLeft.animations.add('pulse').play(10, true);
            botRight.animations.add('pulse').play(10, true);
            

            // pos
            botRight.scale.x = topRight.scale.x = -1;
            botRight.x = topRight.x = this.target.width + this.padding;
            
            this.topIcons.add(topLeft);
            this.topIcons.add(topRight);

            this.botIcons.add(botLeft);
            this.botIcons.add(botRight);

            // pos above char
            this.topIcons.y -= this.topIcons.height / 2;
            this.botIcons.x = this.topIcons.x = this.target.width / 2 - (this.topIcons.width / 2);

            // pos below char
            this.botIcons.y =  this.target.height;
            this.botIcons.y -= this.padding;

            // save init cords
            this.initialPosTop = new Phaser.Point(this.topIcons.x, this.topIcons.y);
            this.initialPosBot = new Phaser.Point(this.botIcons.x, this.botIcons.y);


            this.add(this.topIcons);
            this.add(this.botIcons);

            this.alpha = 0;
        }

        in()
        {
            this.alpha = 1;

            this.addTween(this).from(
                {
                    alpha:0
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.In,
                true
            )

            this.topIcons.position.y = this.initialPosTop.y;
            this.addTween(this.topIcons).from(
                {
                    y:this.initialPosTop.y - 10
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.In,
                true
            )

            this.botIcons.position.y = this.initialPosBot.y;
            this.addTween(this.botIcons).from(
                {
                    y:this.initialPosBot.y + 10
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.In,
                true
            )
        }

        out()
        {
            this.addTween(this).to(
                {
                    alpha:0
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.Out,
                true
            )

            this.addTween(this.topIcons).to(
                {
                    y:this.initialPosTop.y - 10
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.Out,
                true
            )

            this.addTween(this.botIcons).to(
                {
                    y:this.initialPosBot.y + 10
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.Out,
                true
            )
        }

    }
} 