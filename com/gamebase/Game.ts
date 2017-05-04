/// <reference path='../pkframe/refs.ts' />
 
module GameBase {
 
    export class Game extends Pk.PkGame {
 
        constructor() {

            super(new Config()); 

            // add default state
            this.state.add('Menu', GameBase.Menu);
            this.state.add('Intro', GameBase.Intro);
            this.state.add('Main', GameBase.Main);
            this.state.add('GameOver', GameBase.GameOver);

        }
    }
 
    class Config extends Pk.PkConfig
    {

        constructor()
        {
            super();

            // loading load screen assets (logo, loading bar, etc) [pre-preloading]
            this.preLoaderState = Preloader;

            // loading all* game assets
            this.loaderState = Loader;

            this.canvasSize = [1280, 720];


            this.initialState = 'Intro';
        }
    }
    
 
} 