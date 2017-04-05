/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {

		enterKey:Phaser.Key;

		characters:Pk.PkElement;
		charPadding:number = 10;

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

			// set characters group / element
			this.characters = new Pk.PkElement(this.game);

			// add 4 chars
			for(let i = 0; i < 4; i++)
			{
				// create
				var char = new GameBase.Char(this.game, this.game.add.sprite(0, 0, 'char'+(i+1)));
				
				// pos
				char.x = (char.width + this.charPadding) * i;

				// start from diferents frames
				char.animationIdle.setFrame(this.game.rnd.integerInRange(1, 5));

				// add
				this.characters.add(char);
				
			}

			// pos char group
			this.characters.x += 30;
			this.characters.y = this.game.world.centerY;

			// = new Simon(this.game, this.game.add.sprite(0, 0, 'simon'));

    	}

		render()
        {
            this.game.debug.text('(Main Screen) Press [ENTER] to Menu', 35, 35);
        }

    }

}