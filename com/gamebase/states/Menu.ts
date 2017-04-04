/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Menu extends Pk.PkState {

        enterKey:Phaser.Key;

		
        init(param1, param2, param3) // or | init(...args:any[]) |
		{
            super.init(); // if whant override init, you need this line!
			console.log('Menu init');

            console.log('params:', param1, param2, param3);
		}

    	create()
    	{
            super.create();
    		console.log('Menu create');

            // change state bg
            this.game.stage.backgroundColor = "#89aca6";

    		// get the keyboard
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

            // when press the key...
            this.enterKey.onDown.add(()=>{
                this.transition.change('Intro'); // change to state Main
            }, this);

            // creat text
			var text:Phaser.Text = this.game.add.text(
				this.game.world.centerX, 
				this.game.world.centerY, 
				"Press Enter", {
					font: "65px Arial",
					fill: "#ff0044", 
					align: "center"
			});

			// position | middle
			text.anchor.set(0.5);
    		
    	}
    }

}