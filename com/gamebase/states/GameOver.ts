/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class GameOver extends Pk.PkState {

    	create()
    	{
    		console.log('GameOver create');

            // change state bg
            this.game.stage.backgroundColor = "#89aca6";

            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);
    	}

		render()
        {
            this.game.debug.text('GAME OVER -- press F5 to play again', 35, 35);
        }
    }

}