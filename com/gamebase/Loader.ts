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


            // intro
            this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            this.load.image('intro-1', 'assets/states/intro/images/1.jpg');
            this.load.image('intro-2', 'assets/states/intro/images/2.jpg');
            this.load.image('intro-3', 'assets/states/intro/images/3.jpg');

            // chars
            this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/idle.png', 200, 300, 1);
            this.load.spritesheet('char2-idle', 'assets/default/images/chars/heroes/2/idle.png', 150, 200, 1);
            this.load.spritesheet('char3-idle', 'assets/default/images/chars/heroes/3/idle.png', 150, 250, 1);
            this.load.spritesheet('char4-idle', 'assets/default/images/chars/heroes/4/iddle.png', 250, 250, 20);

            // icons
            this.load.image('heath-icon', 'assets/default/images/ui/ico-health.png');
            this.load.image('stamina-icon', 'assets/default/images/ui/ico-stamina.png');
            this.load.image('mana-icon', 'assets/default/images/ui/ico-mana.png');
            this.load.spritesheet('selected-icon', 'assets/default/images/selectable-icon.png', 22, 16, 3);

            // ui hero
            this.load.image('ui-hero-1-on', 'assets/default/images/chars/heroes/1/ui-on.png');
            this.load.image('ui-hero-2-on', 'assets/default/images/chars/heroes/2/ui-on.png');
            this.load.image('ui-hero-3-on', 'assets/default/images/chars/heroes/3/ui-on.png');
            this.load.image('ui-hero-4-on', 'assets/default/images/chars/heroes/4/ui-on.png');

            this.load.image('ui-hero-1-off', 'assets/default/images/chars/heroes/1/ui-off.png');
            this.load.image('ui-hero-2-off', 'assets/default/images/chars/heroes/2/ui-off.png');
            this.load.image('ui-hero-3-off', 'assets/default/images/chars/heroes/3/ui-off.png');
            this.load.image('ui-hero-4-off', 'assets/default/images/chars/heroes/4/ui-off.png');


            // ui hero attacks
            this.load.image('ui-hero-attacks-bg-1', 'assets/default/images/ui/b-large-bg.png');
            this.load.image('ui-hero-attack-bg', 'assets/default/images/ui/b-spell-bg.png');

            this.load.image('ui-hero-operator-' + GameBase.E.Operator.DIVI, 'assets/default/images/ui/b-i-div.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MULT, 'assets/default/images/ui/b-i-multi.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.PLUS, 'assets/default/images/ui/b-i-soma.png');
            this.load.image('ui-hero-operator-' + GameBase.E.Operator.MINU, 'assets/default/images/ui/b-i-sub.png');

            this.load.image('ui-enemy-value-bg', 'assets/default/images/ui/b-monster-bg.png');
            this.load.image('reload-box', 'assets/default/images/ui/reload-box.png');

            // monster
            this.load.spritesheet('monster1-idle', 'assets/default/images/chars/enemies/1/idle.png', 350, 480, 1);
            this.load.spritesheet('monster2-idle', 'assets/default/images/chars/enemies/2/idle.png', 650, 474, 1);
            this.load.spritesheet('monster3-idle', 'assets/default/images/chars/enemies/3/idle.png', 300, 500, 1);
            this.load.spritesheet('monster4-idle', 'assets/default/images/chars/enemies/4/idle.png', 500, 550, 1);
            
            // main
            this.load.image('main-bg', 'assets/states/main/images/bg/s-background.png');
            this.load.image('main-bridge-back', 'assets/states/main/images/bg/s-bridge-back.png');
            this.load.image('main-bridge-front', 'assets/states/main/images/bg/s-bridge-front.png');
 

            // op icons
            this.load.spritesheet('operator-icon-' + E.Operator.MULT, 'assets/default/images/operator-icon-mult.png', 15, 15, 3);
            this.load.spritesheet('operator-icon-' + E.Operator.PLUS, 'assets/default/images/operator-icon-plus.png', 15, 15, 3);
            this.load.spritesheet('operator-icon-' + E.Operator.MINU, 'assets/default/images/operator-icon-min.png', 15, 15, 3);
            this.load.spritesheet('operator-icon-' + E.Operator.DIVI, 'assets/default/images/operator-icon-div.png', 15, 15, 3);
        }

        create()
        {
            super.create();
        }
    }
 
}