/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {

		enterKey:Phaser.Key;

		init(...args:any[])
		{
			super.init(args); // if whant override init, you need this line!
			console.log('Main init', args);
		}

    	create()
    	{
    		// change state bg
            this.game.stage.backgroundColor = "#938da0";

    		// get the keyboard key to come back to menu
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

			// when press the key...
            this.enterKey.onDown.add(()=>{
                this.transition.change('Menu', 1111, 'text', {a:true, b:[1, 2]});  // return with some foo/bar args
            }, this);
    	}

		render()
        {
            this.game.debug.text('Press [ENTER] to Menu', 35, 35);
        }

    }

}