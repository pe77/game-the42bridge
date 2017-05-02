/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Menu extends Pk.PkState {

        enterKey:Phaser.Key;
        musicBG:Phaser.Sound;

        gamelogo:Phaser.Sprite;
        startGameBtn:Phaser.Sprite;

		
        init(param1, param2, param3) // or | init(...args:any[]) |
		{
            super.init(); // if whant override init, you need this line!
			console.log('Menu init');
		}

    	create()
    	{
    		console.log('Menu create');

            // change state bg
            this.game.stage.backgroundColor = "#89aca6";

            // btns | logo | bg
            var bg = this.game.add.sprite(0, 0, 'menu-bg');
            this.gamelogo = this.game.add.sprite(0, 0, 'gamelogo-off');
            this.startGameBtn = this.game.add.sprite(0, 0, 'btn-start-off');

            // pos
            this.gamelogo.anchor.x = this.startGameBtn.anchor.x = 0.5;
            this.startGameBtn.x = this.gamelogo.x = this.game.world.centerX;
            this.startGameBtn.y = this.gamelogo.height + 40;

            this.startGameBtn.inputEnabled = true;
            this.startGameBtn.input.useHandCursor = true;
            this.startGameBtn.events.onInputUp.add(this.startGame, this)
            this.startGameBtn.events.onInputOver.add(this.btnOver, this)
            this.startGameBtn.events.onInputOut.add(this.btnOut, this)



            // audio
            this.musicBG = this.game.add.audio('menu-sound-bg');
            this.musicBG.onDecoded.add(this.playSound, this); // load

    		// get the keyboard
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

            // when press the key...
            this.enterKey.onDown.add(()=>{
                this.startGame();
            }, this);

            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
    	}

        btnOver()
        {
            this.gamelogo.loadTexture('gamelogo-on');
            this.startGameBtn.loadTexture('btn-start-on');
        }

        btnOut()
        {
            this.gamelogo.loadTexture('gamelogo-off');
            this.startGameBtn.loadTexture('btn-start-off');
        }

        startGame()
        {
            this.transition.change('Main'); // change to state Main
        }

        playSound()
        {
            // play music
			this.musicBG.play('', 0, 0.5, true);
        }


		render()
        {
            // this.game.debug.text('(Menu Screen) Press [ENTER] to Main', 35, 35);
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