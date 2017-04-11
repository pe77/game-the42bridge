/// <reference path='../../pkframe/refs.ts' />

module GameBase
{
    export module Transitions
    {
        export class Slide implements Pk.I.TransitionAnimation {

            public event:Pk.PkEvent = new Pk.PkEvent('Transitions.Slide', this);
            public game:Pk.PkGame;

            public retangle:Phaser.Sprite;
            public changeTime:number = 500; // ms

            constructor(game:Pk.PkGame)
            {
                this.game = game;
            }

            start()
            { 
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                new Phaser.Point((this.game.world.width / 2) * (-1), 0), // 1
                new Phaser.Point(this.game.world.width, 0),  // 2
                new Phaser.Point(this.game.world.width, this.game.world.height), // 4
                new Phaser.Point(0, this.game.world.height) // 3
                ]);

                var bg = this.game.add.graphics(0, 0);

                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();

                bg.x = bg.width;

                var slideTween = this.game.add.tween(bg);

                slideTween.to({
                    x:0
                }, this.changeTime);

                slideTween.onComplete.add(function(obj){
                    // dispatch end transition | mandatory
                    console.log('terminou animação');
                    this.event.dispatch(Pk.E.OnTransitionEndStart); 
                }, this);
                

                slideTween.start();
            }


            end()
            { 
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                new Phaser.Point(0, 0), // 1
                new Phaser.Point(this.game.world.width, 0),  // 2
                new Phaser.Point(this.game.world.width + (this.game.world.width / 2), this.game.world.height), // 4
                new Phaser.Point(0, this.game.world.height) // 3
                ]);

                var bg = this.game.add.graphics(0, 0);

                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();
                // bg.width; // phaser


                var slideTween = this.game.add.tween(bg);

                slideTween.to({
                    x:bg.width * (-1)
                }, this.changeTime);

                slideTween.onComplete.add(function(obj){
                    // dispatch end transition | mandatory
                    console.log('terminou animação');
                    this.event.dispatch(Pk.E.OnTransitionEndEnd); 
                }, this);
                

                slideTween.start();
            }
        }
    }
}
