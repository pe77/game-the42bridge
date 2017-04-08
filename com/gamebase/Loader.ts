/// <reference path='../pkframe/refs.ts' />

module GameBase {

    export class Preloader  extends Pk.PkLoaderPreLoader {

        preload()
        {
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

            // default
            this.load.spritesheet('char1', 'assets/default/images/char1.jpg', 58, 96, 5);
            this.load.spritesheet('char2', 'assets/default/images/char2.jpg', 58, 96, 5);
            this.load.spritesheet('char3', 'assets/default/images/char3.jpg', 58, 96, 5);
            this.load.spritesheet('char4', 'assets/default/images/char4.jpg', 58, 96, 5);

            this.load.spritesheet('heath-icon', 'assets/default/images/heath-icon.png', 15, 15, 2);
            this.load.spritesheet('stamina-icon', 'assets/default/images/stamina-icon.png', 15, 15, 2);
            this.load.spritesheet('mana-icon', 'assets/default/images/mana-icon.png', 15, 15, 2);
            this.load.spritesheet('selected-icon', 'assets/default/images/selectable-icon.png', 22, 16, 3);

            // state main
            this.load.image('titlepage', 'assets/states/main/images/titlepage.jpg');
        }

        create()
        {
            super.create();
        }
    }
 
}