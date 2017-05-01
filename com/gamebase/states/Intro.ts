/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Intro extends Pk.PkState {

        padding:number = 0;
        musicBG:Phaser.Sound;

        boxs:Array<GameBase.IntroBox> = new Array();
        boxsIndex:number = 0;
        boxsDelay:number = 1000 * 8; // sec
        boxsInterval:number;

        skipButton:Pk.PkElement;

        endIntro:boolean = false;

    	create()
    	{
    		// change state bg
            this.game.stage.backgroundColor = "#000";

            // add boxs
            for (let i = 1; i <= 10; i++) 
                this.boxs.push(
                    new GameBase.IntroBox(
                        this.game, 
                        this.add.sprite(0, 0, 'intro-' + i)
                    )
                );
            //

            // boxs time adjust
            this.boxs[0].time = 1000 * 8;
            this.boxs[1].time = 1000 * 8;
            this.boxs[2].time = 1000 * 8;
            this.boxs[3].time = 1000 * 8;
            
            // pos boxs
            for(var i in this.boxs)
            {
                var b = this.boxs[i];

                // pos
                b.x = this.game.world.centerX - (b.width / 2); // center
                b.y += this.padding; // padding
            }

            // audio
            this.musicBG = this.game.add.audio('intro-sound');
            this.musicBG.onDecoded.add(this.playSound, this); // load

            // on sound complete
            this.musicBG.onStop.add(this.end, this);

            // skip "button" text
            this.skipButton = new Pk.PkElement(this.game);
            var skipText = this.game.add.text(
				0, // x
				0, // y
				" skip" // text
                , {
                    // font details
					font: "52px StrangerBack",
					fill: "#fff"
			});
            skipText.align = "left";
            skipText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

            // add in object
            this.skipButton.add(skipText);

            // enable input and hand cursor
            this.skipButton.setAll('inputEnabled', true);
            this.skipButton.setAll('input.useHandCursor', true);

            // position
            this.skipButton.x = this.game.width - this.skipButton.width - 30;
            this.skipButton.y = 25;

            // skip action
            this.skipButton.callAll('events.onInputUp.add', 'events.onInputUp', this.end, this);

            // skipp button show delay
            this.game.add.tween(this.skipButton).from(
                {
                    y: this.skipButton.height * (-1)
                }, // props
                500, // animation time
                Phaser.Easing.Linear.None, // tween
                true, // auto start
                1500 // delay | 1.5 sec
            )




            // play boxes
            this.play();
    	}

        play()
        {
            // if has no boxes
            if(!this.boxs.length || this.endIntro)
                return;
            //

            // if last box
            if(this.boxsIndex == this.boxs.length)
            {
                this.end();
                return;
            }

            this.boxs[this.boxsIndex].in(0);

            this.boxs[this.boxsIndex].event.add(
                GameBase.E.IntroBoxEvent.OnIntroBoxEnd,
                this.play,
                this
                )

            // next
            this.boxsIndex++;
        }


        end()
        {
            this.endIntro = true;

            this.skipButton.visible = false;

            this.musicBG.fadeOut(1000);

            setTimeout(()=>{
                this.transition.change('Menu'); 
            }, 1000)
            
        }

        playSound()
        {
            // play music
            this.musicBG.play('', 0, 0.6)
        }

        // calls when leaving state
        shutdown()
        {
            if(this.musicBG.isPlaying)
                this.musicBG.stop();
            //
        }

        

    }

}