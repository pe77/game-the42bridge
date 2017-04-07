/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Intro extends Pk.PkState {

        padding:number = 30;
        musicBG:Phaser.Sound;

        boxs:Array<GameBase.IntroBox> = new Array();
        boxsIndex:number = 0;
        boxsDelay:number = 5000;
        boxsInterval:number;

        skipButton:Pk.PkElement;

    	create()
    	{
    		// change state bg
            this.game.stage.backgroundColor = "#000";

            // add boxs
            this.boxs.push(
                new GameBase.IntroBox(
                    this.game, 
                    this.add.sprite(0, 0, 'intro-1'), 
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
            );

            this.boxs.push(
                new GameBase.IntroBox(
                    this.game, 
                    this.add.sprite(0, 0, 'intro-2'), 
                    "Nor again is there anyone sit who loves or pursues or desires to obtain pain of itself, because it is pain.")
            );

            this.boxs.push(
                new GameBase.IntroBox(
                    this.game, 
                    this.add.sprite(0, 0, 'intro-3'), 
                    "Ut enim ad minima veniam, exercitationem ullam laboriosam, nisi ut aliquid ex ea commodi consequatur?")
            );

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
				"Skip >>" // text
                , {
                    // font details
					font: "12px Arial",
					fill: "#fff"
			});
            skipText.align = "left";

            // add in object
            this.skipButton.add(skipText);

            // enable input and hand cursor
            this.skipButton.setAll('inputEnabled', true);
            this.skipButton.setAll('input.useHandCursor', true);

            // position
            this.skipButton.x = this.game.width - this.skipButton.width - this.padding;
            this.skipButton.y = this.padding;

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
            this.playBoxs();
            
    	}

        playBoxs()
        {
             // if has no boxes
            if(!this.boxs.length)
                return;
            //

            // next ones
            this.boxsInterval = setInterval(()=>{
                this.playBox();
            }, this.boxsDelay);

            this.playBox();
            
        }

        playBox()
        {
            // finish last box
            if(this.boxsIndex > 0)
                this.boxs[this.boxsIndex-1].out();
            // 

            // if last box
            if(this.boxsIndex == this.boxs.length)
            {
                setTimeout(()=>{
                    clearInterval(this.boxsInterval);
                    this.end();
                }, 1500);

                return;
            }

            // play
            this.boxs[this.boxsIndex].in(500);

            // next
            this.boxsIndex++;
        }

        end()
        {
            // change state
            this.transition.change('Menu'); 
        }

        playSound()
        {
            // play music
            // this.musicBG.fadeIn(3000, false);
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