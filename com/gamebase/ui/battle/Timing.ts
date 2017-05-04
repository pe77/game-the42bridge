
module GameBase {
 
    export class Timing extends Pk.PkElement {
        
        text:Phaser.Text;
        clock:Phaser.Sprite;
        bar:Phaser.Sprite;

        seconds:number = 10; // 10 sec

        tweenBar:Phaser.Tween;

        barSize:number = 221;
        
        create()
        {
            // timing bar
            this.bar = Pk.PkUtils.createSquare(this.game, this.barSize, 15, "#eddacc")
            
            // clock
            this.clock = this.game.add.sprite(0, 0, 'ui-battle-clock');

            // pos 
            this.bar.anchor.x = 1;
            this.bar.x += this.bar.width;

            this.clock.anchor.set(0.5, 0.5);
            this.clock.y += 8;
            this.clock.x = this.bar.width + 10;

            this.add(this.bar);
            this.add(this.clock);
            
            this.visible = false;

            var t:Phaser.Tween = this.addTween(this.clock).to({
                width:this.clock.width+5,
                height:this.clock.height+5,
            },
            500,
            Phaser.Easing.Back.InOut,
            true, 
            0,
            -1,
            true
            )

            // t.yoyo(true)

        }


        stop()
        {
            this.visible = false;

            // stop tween
            if(this.tweenBar)
                this.tweenBar.stop();
            //

        }

        pause()
        {
            if(this.tweenBar)
                this.tweenBar.pause();
            //
        }

        resume()
        {
            if(this.tweenBar)
                this.tweenBar.resume();
            //
        }

        start()
        {
            // reset bar size
            this.bar.width = this.barSize;

            // stop tween
            this.stop();

            this.visible = true;

            this.tweenBar = null;


            this.tweenBar = this.addTween(this.bar).to(
                {
                    width:0
                },
                Phaser.Timer.SECOND * this.seconds,
                Phaser.Easing.Linear.None
            )


            
            // end bar event
            this.tweenBar.onComplete.add(()=>{
                this.event.dispatch(GameBase.E.TimingEvent.OnEnd);
            }, this);

            // start tween
            this.tweenBar.start();
            
        }

    }

    export module E 
    {
        export module TimingEvent
        {
            export const OnEnd:string 	= "OnEndTimingEvent";
        }
    }

} 