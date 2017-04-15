/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {

		enterKey:Phaser.Key;

		heroes:Pk.PkElement;
		charPadding:number = 15;

		padding:number = 20;

		init(...args:any[])
		{
			super.init(args); // if whant override init, you need this line!
		}

    	create()
    	{

    		// change state bg
            this.game.stage.backgroundColor = "#938da0";

			// prevent stop update when focus out
            this.stage.disableVisibilityChange = true;

    		// get the keyboard key to come back to menu
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

			// when press the key...
            this.enterKey.onDown.add(()=>{
                // this.transition.change('Menu', 1111, 'text', {a:true, b:[1, 2]});  // return with some foo/bar args
            }, this);

			// add layers
			this.addLayer('stage-back-1');
			this.addLayer('stage-back-2');
			this.addLayer('stage-back-3');
			this.addLayer('chars');
			this.addLayer('stage-front-1');
			this.addLayer('ui');


			// scenario sprites
			var mainBg:Phaser.Sprite = this.game.add.sprite(0, 0, 'main-bg');
			var mainBridgeBack:Phaser.Sprite = this.game.add.sprite(0, 0, 'main-bridge-back');
			var mainBridgeFront:Phaser.Sprite = this.game.add.sprite(0, 0, 'main-bridge-front');


			// set characters group / element
			this.heroes = new Pk.PkElement(this.game);

			// create heroes
			var druid = new GameBase.Druid(this.game);
			druid.create();

			var thief = new GameBase.Thief(this.game);
			thief.create();

			var priest = new GameBase.Priest(this.game);
			priest.create();

			var knight = new GameBase.Knight(this.game);
			knight.create();

			// add
			
			this.heroes.add(druid);
			this.heroes.add(thief);
			this.heroes.add(priest);
			this.heroes.add(knight);
			

			var i = 0;
			this.heroes.forEach((hero:GameBase.Hero)=>{
				
				// pos
				hero.x = this.padding;
				
				if(i > 0)
				{
					var lastHero = <Hero>this.heroes.getAt(i-1);
					hero.x = lastHero.x + lastHero.body.width + this.charPadding;
				}
				hero.y = this.game.height - hero.body.height - this.padding - 145;
				

				// pos ui
				hero.ui.x = 170 * i;
				hero.ui.y = hero.y + 45;
				hero.ui.setAsInitialCords();

				hero.y += 10 * i; // stars style

				// pos ui
				hero.uiAttack.x = 140 * i;
				hero.uiAttack.y = hero.y - hero.uiAttack.height;
				hero.uiAttack.setAsInitialCords();

				
				
				// add ui to layer
				this.addToLayer('ui', hero.ui);
				this.addToLayer('ui', hero.uiAttack);

				// next node
				i++;
			}, this);

			// ????
			knight.ui.x -= 75;
			knight.ui.setAsInitialCords();

			// add chars to layer
			this.addToLayer('chars', this.heroes);

			// scenario position
			mainBridgeBack.y = 443;
			mainBridgeFront.y = 540;

			this.addToLayer('stage-back-1', mainBg);
			this.addToLayer('stage-back-2', mainBridgeBack);
			this.addToLayer('stage-front-1', mainBridgeFront);
			
			// transition
			this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
    	}

		render()
        {
            // this.game.debug.text('(Main Screen) Press [ENTER] to Menu', 35, 35);
        }

    }

}