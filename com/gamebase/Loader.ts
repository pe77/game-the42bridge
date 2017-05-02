/// <reference path='../pkframe/refs.ts' />

module GameBase {

    export class Preloader  extends Pk.PkLoaderPreLoader {

        preload()
        {
            // utils / vendor
            this.load.script('WebFont', 'com/gamebase/vendor/webfontloader.js');

            // load game loading bar
            this.load.image('game-loading-bar', 'assets/states/loader/images/loading-bar.png');

            // load game loading logo
            this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
        }

    }
 
    export class Loader extends Pk.PkLoader implements Pk.I.Loader {

        loadingBar:Phaser.Sprite;
        logo:Phaser.Sprite;
        loadingText:Phaser.Text;
        
        init()
        {
            super.init();
        }

        preload()
        {
            // ignore preloading bar
            // super.preload();

            // creating sprites from preloadead images
            this.logo           = this.add.sprite(0, 0, 'game-loading-logo');
            
            // create custom loading bar
            this.loadingBar = Pk.PkUtils.createSquare(this.game, this.game.width, 20, "#ffffff");

            // set sprite as preloading
            this.load.setPreloadSprite(this.loadingBar);

            // pos loading bar on bot
            this.loadingBar.y = this.world.height - this.loadingBar.height;

            // positioning logo on middle
            this.logo.anchor.set(.5, .5);
            this.logo.position.set(this.game.width/2, this.game.height/2);

            // add a preloadead logo
            this.game.add.existing(this.logo);

            this.logo.alpha = 0;

            this.loadingText = this.game.add.text(0, 0,
				'0%', // text
				{
					font: "150px StrangerBack",
					fill: "#ffffff"
				} // font style
			);
            this.loadingText.anchor.set(.5, .5);

            this.loadingText.x = this.world.centerX;
            this.loadingText.y = this.world.centerY;

            // fileComplete
            // this.fil
            this.game.load.onFileComplete.add((progress:number)=>{
                var v:number = Math.round((progress * 0.01) * 42);
                this.loadingText.text = v + '%';
            }, this)


            //  ** ADDING Other things  ** //

            // scripts
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js')

            // generic
            // this.load.image('cinematic-bg', 'assets/states/intro/images/cinematic-bg.jpg');

            // intro
            this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            for (var i = 1; i <= 10; i++) 
                this.load.image('intro-'+i, 'assets/states/intro/images/Cin_00'+i+'.jpg');
            //

            // menu
            this.load.audio('menu-sound-bg', 'assets/states/menu/audio/menu.mp3');

            this.load.image('btn-start-on', 'assets/default/images/ui/btn-start-on.png');
            this.load.image('btn-start-off', 'assets/default/images/ui/btn-start-off.png');

            this.load.image('gamelogo-on', 'assets/default/images/ui/logo.png');
            this.load.image('gamelogo-off', 'assets/default/images/ui/logo2.png');

            // battle :: ANW2683_06_Runway-To-Ignition.mp3
            this.load.audio('battle-sound', 'assets/states/main/audio/battle.mp3');
            
            // sounds fx
            this.load.audio('a-hero-selected', 'assets/default/audio/fx/a_selecao.wav');
            this.load.audio('a-hero-menu', 'assets/default/audio/fx/a_menuchar.wav');
            this.load.audio('a-hero-attack-selected', 'assets/default/audio/fx/a_selGolpe.wav');
            this.load.audio('a-enemy-die', 'assets/default/audio/fx/a_golpe.wav');
            this.load.audio('a-enemy-taking-damage', 'assets/default/audio/fx/monsterTakingHit.mp3');
            this.load.audio('a-hero-res', 'assets/default/audio/fx/Ress.mp3');

            // particles
            this.load.image('particle-1', 'assets/states/main/images/particles/p1.png');
            this.load.image('particle-2', 'assets/states/main/images/particles/p2.png');
            this.load.image('particle-3', 'assets/states/main/images/particles/p3.png');
            this.load.image('particle-4', 'assets/states/main/images/particles/p4.png');
            this.load.image('particle-5', 'assets/states/main/images/particles/p5.png');

            // chars || iddle
            this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
            this.load.spritesheet('char2-idle', 'assets/default/images/chars/heroes/2/iddle.png', 138, 166, 12);
            this.load.spritesheet('char3-idle', 'assets/default/images/chars/heroes/3/iddle.png', 180, 245, 12);
            this.load.spritesheet('char4-idle', 'assets/default/images/chars/heroes/4/iddle.png', 211, 204, 12);

            // dead
            this.load.image('char1-dead', 'assets/default/images/chars/heroes/1/dead.png');
            this.load.image('char2-dead', 'assets/default/images/chars/heroes/2/dead.png');
            this.load.image('char3-dead', 'assets/default/images/chars/heroes/3/dead.png');
            this.load.image('char4-dead', 'assets/default/images/chars/heroes/4/dead.png');

            // dead by hero audio
            // assets\default\audio\hero\4
            this.load.audio('a-char1-dead', 'assets/default/audio/hero/1/death.mp3');
            this.load.audio('a-char2-dead', 'assets/default/audio/hero/2/death.mp3');
            this.load.audio('a-char3-dead', 'assets/default/audio/hero/3/death.mp3');
            this.load.audio('a-char4-dead', 'assets/default/audio/hero/4/death.mp3');

            // hero attack audio
            this.load.audio('a-char1-attack', 'assets/default/audio/hero/1/attack.mp3');
            this.load.audio('a-char2-attack', 'assets/default/audio/hero/2/attack.mp3');
            this.load.audio('a-char3-attack', 'assets/default/audio/hero/3/attack.mp3');
            this.load.audio('a-char4-attack', 'assets/default/audio/hero/4/attack.mp3');

            // enemy attack audio
            this.load.audio('a-enemy-attack', 'assets/default/audio/fx/monsterAttack.mp3');

            // icons
            this.load.image('heath-icon', 'assets/default/images/ui/ico-health.png');
            this.load.image('health-icon-large', 'assets/default/images/ui/ico-health-large.png');
            this.load.image('stamina-icon', 'assets/default/images/ui/ico-stamina.png');
            this.load.image('stamina-icon-large', 'assets/default/images/ui/ico-stamina-large.png');
            this.load.image('mana-icon', 'assets/default/images/ui/ico-mana.png');
            this.load.image('mana-icon-large', 'assets/default/images/ui/ico-mana-large.png');

            // ui hero
            this.load.image('ui-hero-1-on', 'assets/default/images/chars/heroes/1/ui-on.png');
            this.load.image('ui-hero-2-on', 'assets/default/images/chars/heroes/2/ui-on.png');
            this.load.image('ui-hero-3-on', 'assets/default/images/chars/heroes/3/ui-on.png');
            this.load.image('ui-hero-4-on', 'assets/default/images/chars/heroes/4/ui-on.png');

            this.load.image('ui-hero-1-selected', 'assets/default/images/chars/heroes/1/selected.png');
            this.load.image('ui-hero-2-selected', 'assets/default/images/chars/heroes/2/selected.png');
            this.load.image('ui-hero-3-selected', 'assets/default/images/chars/heroes/3/selected.png');
            this.load.image('ui-hero-4-selected', 'assets/default/images/chars/heroes/4/selected.png');
            
            this.load.image('ui-hero-1-off', 'assets/default/images/chars/heroes/1/ui-off.png');
            this.load.image('ui-hero-2-off', 'assets/default/images/chars/heroes/2/ui-off.png');
            this.load.image('ui-hero-3-off', 'assets/default/images/chars/heroes/3/ui-off.png');
            this.load.image('ui-hero-4-off', 'assets/default/images/chars/heroes/4/ui-off.png');

            // hero attack icon
            this.load.image('ui-hero-1-attack-icon', 'assets/default/images/chars/heroes/1/magic.png');
            this.load.image('ui-hero-2-attack-icon', 'assets/default/images/chars/heroes/2/magic.png');
            this.load.image('ui-hero-3-attack-icon', 'assets/default/images/chars/heroes/3/magic.png');
            this.load.image('ui-hero-4-attack-icon', 'assets/default/images/chars/heroes/4/magic.png');

            // hero attack
            this.load.image('ui-hero-1-attack-1', 'assets/default/images/ui/attack/Druid/1.png');
            this.load.image('ui-hero-1-attack-2', 'assets/default/images/ui/attack/Druid/2.png');
            this.load.image('ui-hero-1-attack-3', 'assets/default/images/ui/attack/Druid/3.png');

            this.load.image('ui-hero-2-attack-1', 'assets/default/images/ui/attack/Thief/1.png');
            this.load.image('ui-hero-2-attack-2', 'assets/default/images/ui/attack/Thief/2.png');
            this.load.image('ui-hero-2-attack-3', 'assets/default/images/ui/attack/Thief/3.png');

            this.load.image('ui-hero-3-attack-1', 'assets/default/images/ui/attack/Priest/1.png');
            this.load.image('ui-hero-3-attack-2', 'assets/default/images/ui/attack/Priest/2.png');
            this.load.image('ui-hero-3-attack-3', 'assets/default/images/ui/attack/Priest/3.png');

            this.load.image('ui-hero-4-attack-1', 'assets/default/images/ui/attack/Knight/1.png');
            this.load.image('ui-hero-4-attack-2', 'assets/default/images/ui/attack/Knight/2.png');
            this.load.image('ui-hero-4-attack-3', 'assets/default/images/ui/attack/Knight/3.png');


            this.load.image('ui-hero-revive', 'assets/default/images/ui/a-blessed.png');
            this.load.image('ui-hero-dead-count', 'assets/default/images/ui/dead-count.png');

            // ui hero attacks
            this.load.image('ui-hero-attacks-bg-1', 'assets/default/images/ui/b-large-bg.png');
            this.load.image('ui-hero-attack-bg-' + GameBase.E.AttributeType.MANA, 'assets/default/images/ui/b-spell-bg-mana.png');
            this.load.image('ui-hero-attack-bg-' + GameBase.E.AttributeType.STAMINA, 'assets/default/images/ui/b-spell-bg-stamina.png');

            this.load.image('ui-hero-attack-calculate', 'assets/default/images/ui/s-calculate.png');
            
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.DIVI, 'assets/default/images/ui/b-i-div.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MULT, 'assets/default/images/ui/b-i-multi.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.PLUS, 'assets/default/images/ui/b-i-soma.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MINU, 'assets/default/images/ui/b-i-sub.png');

            this.load.image('ui-enemy-value-bg', 'assets/default/images/ui/b-monster-bg.png');
            this.load.image('reload-box', 'assets/default/images/ui/reload-box.png');

            // monster
            this.load.spritesheet('monster1-idle', 'assets/default/images/chars/enemies/1/idle.png', 278, 365, 12);
            this.load.spritesheet('monster2-idle', 'assets/default/images/chars/enemies/2/idle.png', 588, 392, 15);
            this.load.spritesheet('monster3-idle', 'assets/default/images/chars/enemies/3/idle.png', 217, 395, 13);
            this.load.spritesheet('monster4-idle', 'assets/default/images/chars/enemies/4/iddle.png', 561.5555555555556, 550, 16);

            this.load.spritesheet('monster-damage', 'assets/default/images/ui/attack/clawAttack.png', 400, 600, 6);

            // battle
            this.load.image('level-flag', 'assets/default/images/ui/d-flag.png');
            this.load.image('endturn-button', 'assets/default/images/ui/d-bg-over.png');
            
            // main
            this.load.image('main-bg', 'assets/states/main/images/bg/s-background.png');
            this.load.image('main-bridge-back', 'assets/states/main/images/bg/s-bridge-back.png');
            this.load.image('main-bridge-front', 'assets/states/main/images/bg/s-bridge-front.png');
            
            // game-over
            this.load.image('gameover-win', 'assets/states/gameover/images/win.jpg');
            this.load.image('gameover-lose', 'assets/states/gameover/images/lose.jpg');
            this.load.image('gameover-credits', 'assets/states/gameover/images/credits.jpg');


            // op icons
            // this.load.spritesheet('operator-icon-' + E.Operator.MULT, 'assets/default/images/operator-icon-mult.png', 15, 15, 3);
            // this.load.spritesheet('operator-icon-' + E.Operator.PLUS, 'assets/default/images/operator-icon-plus.png', 15, 15, 3);
            // this.load.spritesheet('operator-icon-' + E.Operator.MINU, 'assets/default/images/operator-icon-min.png', 15, 15, 3);
            // this.load.spritesheet('operator-icon-' + E.Operator.DIVI, 'assets/default/images/operator-icon-div.png', 15, 15, 3);
        }

        create()
        {
            super.create();
        }
    }
 
}
