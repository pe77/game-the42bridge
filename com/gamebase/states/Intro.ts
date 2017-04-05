/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Intro extends Pk.PkState {

        padding:number = 30;
        musicBG:Phaser.Sound;

        text:Phaser.Text;
        textMask:Phaser.Graphics;

        images:Array<Phaser.Sprite> = new Array();

        skipButton:Pk.PkElement;

    	create()
    	{
    		// change state bg
            this.game.stage.backgroundColor = "#000";

            // auto bypass
    		setTimeout(()=>{
				// change state
                // this.transition.change('Main');
    		}, 1000);

            // creat text
            var textWidth:number = this.game.width - (this.padding*2);
			this.text = this.game.add.text(
				0, // x
				0, // y
                // text
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."+
                "\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."+
                "\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."+
                "\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                , {
                    // font details
					font: "25px Arial",
					fill: "#fff", 
					boundsAlignH: "center", 
                    boundsAlignV: "top",
                    wordWrap: true,
                    wordWrapWidth: textWidth
			});

            this.text.align = "center";

            this.text.cacheAsBitmap = true;

            this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

            console.log('text h:', this.text.height);

            // text bounds
            this.text.setTextBounds(
                this.padding,       // x
                this.game.height + 30,   // y
                textWidth,          // width
                this.text.height    // heigth
            );

            // audio
            this.musicBG = this.game.add.audio('intro-sound');
            this.musicBG.onDecoded.add(this.playSound, this); // load

            // on sound complete
            this.musicBG.onStop.add(this.end, this);

            // text area mask
            var maskHeigth = 190;
            // this.textMask = this.game.add.graphics(this.game.world.centerX - textWidth / 2, this.game.height - maskHeigth - this.padding);
            this.textMask = this.game.add.graphics(0, 0);
            this.textMask.beginFill(0x000);
            this.textMask.drawRect(0, 0, textWidth, maskHeigth);
            this.textMask.endFill();

            this.textMask.x = this.game.world.centerX - textWidth / 2;
            this.textMask.y = this.game.height - maskHeigth - this.padding;

            // set as a text mask
            this.text.mask = this.textMask;

            // add images
            this.images.push(this.add.sprite(0, 0, 'intro-1'));

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

    	}

        end()
        {
            // change state
            this.transition.change('Menu'); 
        }

        playSound()
        {
            // play music
            this.musicBG.fadeIn(3000, false);
        }

        update()
        {
            this.text.y -= 0.5;
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