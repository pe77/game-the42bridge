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
        
        init()
        {
            super.init();
        }

        preload()
        {
            // ignore preloading bar
            // super.preload();

            // creating sprites from preloadead images
            this.loadingBar     = this.add.sprite(0, 0, 'game-loading-bar');
            this.logo           = this.add.sprite(0, 0, 'game-loading-logo');
            
            // position loading bar | middle
            this.loadingBar.anchor.x = 0.5;
            this.loadingBar.x = this.game.width / 2;
            this.loadingBar.y = this.game.height - this.loadingBar.height;

            // set sprite as preloading
            this.load.setPreloadSprite(this.loadingBar);

            // positioning logo on middle
            this.logo.anchor.set(.5, .5);
            this.logo.position.set(this.game.width/2, this.game.height/2);

            // add a preloadead logo
            this.game.add.existing(this.logo);

            this.logo.alpha = 0;



            //  ** ADDING Other things  ** //

            // scripts
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js')


            // intro
            this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            this.load.image('intro-1', 'assets/states/intro/images/1.jpg');
            this.load.image('intro-2', 'assets/states/intro/images/2.jpg');
            this.load.image('intro-3', 'assets/states/intro/images/3.jpg');

            // battle :: ANW2683_06_Runway-To-Ignition.mp3
            this.load.audio('battle-sound', 'assets/states/main/audio/battle.mp3');
            
            // sounds fx
            this.load.audio('a-hero-selected', 'assets/default/audio/fx/a_selecao.wav');
            this.load.audio('a-hero-menu', 'assets/default/audio/fx/a_menuchar.wav');
            this.load.audio('a-hero-attack-selected', 'assets/default/audio/fx/a_selGolpe.wav');
            this.load.audio('a-enemy-die', 'assets/default/audio/fx/a_golpe.wav');

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
            this.load.spritesheet('char1-dead', 'assets/default/images/chars/heroes/1/dead.png', 391, 304, 1);
            this.load.spritesheet('char2-dead', 'assets/default/images/chars/heroes/2/dead.png', 391, 304, 1);
            this.load.spritesheet('char3-dead', 'assets/default/images/chars/heroes/3/dead.png', 391, 304, 1);
            this.load.image('char4-dead', 'assets/default/images/chars/heroes/4/dead.png');


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
            this.load.spritesheet('monster1-idle', 'assets/default/images/chars/enemies/1/idle.png', 350, 480, 1);
            this.load.spritesheet('monster2-idle', 'assets/default/images/chars/enemies/2/idle.png', 588, 392, 15);
            this.load.spritesheet('monster3-idle', 'assets/default/images/chars/enemies/3/idle.png', 217, 395, 13);
            this.load.spritesheet('monster4-idle', 'assets/default/images/chars/enemies/4/idle.png', 500, 550, 1);

            // battle
            this.load.image('level-flag', 'assets/default/images/ui/d-flag.png');
            this.load.image('endturn-button', 'assets/default/images/ui/d-bg-over.png');
            
            // main
            this.load.image('main-bg', 'assets/states/main/images/bg/s-background.png');
            this.load.image('main-bridge-back', 'assets/states/main/images/bg/s-bridge-back.png');
            this.load.image('main-bridge-front', 'assets/states/main/images/bg/s-bridge-front.png');
 

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
