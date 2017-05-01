/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {

		enterKey:Phaser.Key;

		heroes:Pk.PkElement;
		enemies:Pk.PkElement;
		charPadding:number = 15;

		padding:number = 20;
		battles:Array<GameBase.Battle> = [];
		battleCount:number = 0;

		musicBG:Phaser.Sound;

		init(...args:any[])
		{
			super.init(args); // if whant override init, you need this line!
		}

    	create()
    	{
			super.create();

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
			this.addLayer('block');

			// scene particles
			var front_emitter = this.game.add.emitter(this.game.world.width, -32, 600);
			front_emitter.makeParticles('particle-1');
			front_emitter.maxParticleScale = 0.3;
			front_emitter.minParticleScale = 0.1;
			front_emitter.setYSpeed(20, 60);
			front_emitter.setXSpeed(-20, -100);
			front_emitter.gravity = 0;
			front_emitter.width = this.game.world.width * 1.5;
			front_emitter.minRotation = 0;
			front_emitter.maxRotation = 40;

			front_emitter.start(false, 14000, 60);


			var back_emitter = this.game.add.emitter(this.game.world.width, -32, 600);
			back_emitter.makeParticles('particle-2');
			back_emitter.maxParticleScale = 0.6;
			back_emitter.minParticleScale = 0.1;
			back_emitter.setYSpeed(20, 30);
			back_emitter.setXSpeed(-10, -50);
			back_emitter.gravity = 0;
			back_emitter.width = this.game.world.width * 2.5;
			back_emitter.minRotation = 0;
			back_emitter.maxRotation = 60;

			back_emitter.start(false, 24000, 350);

			// audio
            this.musicBG = this.game.add.audio('battle-sound');
            this.musicBG.onDecoded.add(this.playSound, this); // load

			// stage sprites
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

			// create a enemies
			var lizzard:GameBase.Lizzard = new GameBase.Lizzard(this.game);
			lizzard.create();
			lizzard.x = this.game.world.width - lizzard.width - 100;
			lizzard.y = 180;
			lizzard.ui.updatePosition();

			var wolf:GameBase.Wolf = new GameBase.Wolf(this.game);
			wolf.create();
			wolf.x = this.game.world.width - wolf.body.width;
			wolf.y = 230;
			wolf.ui.updatePosition();

			
			var ghost:GameBase.Ghost = new GameBase.Ghost(this.game);
			ghost.create();
			ghost.x = this.game.world.width - ghost.width - 120;
			ghost.y = 170;
			ghost.ui.updatePosition();


			var devil:GameBase.Devil = new GameBase.Devil(this.game);
			devil.create();
			devil.x = this.game.world.width - devil.width;
			devil.y = 120;
			devil.ui.updatePosition();

			var i = 0;
			this.heroes.forEach((hero:GameBase.Hero)=>{

				// pos
				hero.x = this.padding;
				
				if(i > 0)
				{
					var lastHero = <Hero>this.heroes.getAt(i-1);
					hero.x = lastHero.x + lastHero.body.width + this.charPadding;
				}
				hero.y = this.game.height - hero.body.height - 195 + (i*5);
				
				// pos ui
				if(i > 0)
					hero.ui.x = lastHero.ui.x + lastHero.ui.width - 10; // WORK
				//
				
				hero.ui.y = this.game.world.height - hero.ui.height - this.padding;
				hero.ui.setAsInitialCords();

				// pos ui
				hero.uiAttack.x = 160 * i - (10*i);
				hero.uiAttack.y = hero.y - hero.uiAttack.height + 50;
				hero.uiAttack.setAsInitialCords();

				hero.updatePosition();
				
				// next node
				i++;
			}, this);

			// ???? 
			/*
			druid.ui.x = 0; druid.ui.setAsInitialCords();
			thief.ui.x = 168; thief.ui.setAsInitialCords();
			priest.ui.x = 356; priest.ui.setAsInitialCords();
			knight.ui.x = 454; knight.ui.setAsInitialCords();
			*/
			
			// add chars to layer
			this.addToLayer('chars', this.heroes);
			this.addToLayer('chars', lizzard);
			this.addToLayer('chars', wolf);
			this.addToLayer('chars', ghost);
			this.addToLayer('chars', devil);
		
			// add hero ui
			this.heroes.forEach((hero:GameBase.Hero)=>{
				this.addToLayer('ui', hero.ui);
				this.addToLayer('ui', hero.uiAttack);
			}, this);


			// monster ui
			this.addToLayer('ui', lizzard.ui);
			this.addToLayer('ui', wolf.ui);
			this.addToLayer('ui', ghost.ui);
			this.addToLayer('ui', devil.ui);

			// scenario position
			mainBridgeBack.y = 413;
			mainBridgeFront.y = 510;

			this.addToLayer('stage-back-1', mainBg);

			this.addToLayer('stage-back-2', back_emitter);
			this.addToLayer('stage-back-2', mainBridgeBack);
			
			this.addToLayer('stage-front-1', mainBridgeFront);
			this.addToLayer('stage-front-1', front_emitter);
			
			
			// transition
			this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);

			// create battles
			var battle1:GameBase.Battle = new GameBase.Battle(this.game, this, 1);
			battle1.create('ui', 'block');

			// add heroes and enemies
			this.heroes.forEach((hero:GameBase.Hero)=>{
				battle1.addHero(hero);
			}, this);
			battle1.addEnemy(lizzard); 


			var battle2:GameBase.Battle = new GameBase.Battle(this.game, this, 2);
			battle2.create('ui', 'block');

			// add heroes and enemies
			this.heroes.forEach((hero:GameBase.Hero)=>{
				battle2.addHero(hero);
			}, this);
			battle2.addEnemy(wolf);


			var battle3:GameBase.Battle = new GameBase.Battle(this.game, this, 3);
			battle3.create('ui', 'block');

			// add heroes and enemies
			this.heroes.forEach((hero:GameBase.Hero)=>{
				battle3.addHero(hero);
			}, this);
			battle3.addEnemy(ghost);


			var battle4:GameBase.Battle = new GameBase.Battle(this.game, this, 4);
			battle4.create('ui', 'block');

			// add heroes and enemies
			this.heroes.forEach((hero:GameBase.Hero)=>{
				battle4.addHero(hero);
			}, this);
			battle4.addEnemy(devil);


			// add battles
			this.battles.push(battle1);
			this.battles.push(battle2);
			this.battles.push(battle3);
			this.battles.push(battle4);

			// start calling battles
			this.callNextBattle();

			setTimeout(()=>{
				// knight.die();
				
			}, 1500);

    	}
		
		playSound()
        {
            // play music
            // this.musicBG.fadeIn(1000, true);
			this.musicBG.play();
			this.musicBG.loop = true;
			this.musicBG.volume = 0.5;
        }

		callNextBattle()
		{
			// check if is play all battles
			if(this.battleCount >= this.battles.length) // win all battles
			{
				alert('You win all battles!');
				this.transition.change('GameOver');
				return;
			}

			// call next one
			var battle:GameBase.Battle =  this.battles[this.battleCount];
			battle.event.add(GameBase.E.BattleEvent.OnBattleEnd, (event, win)=>{
				// if win/lose
				if(win)
				{
					// add count, call next
					this.battleCount++;
					this.callNextBattle();
				}else{
					// game over screen
					this.transition.change('GameOver');
				}

			}, this);

			// start battle
			battle.start();
		}

		render()
        {
            // this.game.debug.text('(Main Screen) Press [ENTER] to Menu', 35, 35);
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