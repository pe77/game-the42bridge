/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class GameOver extends Pk.PkState {

        win:boolean;
        bg:Phaser.Sprite;

        init(win)
        {
            super.init(); 
            this.win = win;
        }

    	create()
    	{
    		console.log('GameOver create');

            // change state bg
            this.game.stage.backgroundColor = "#89aca6";

            // if win
            if(this.win)
                this.bg = this.game.add.sprite(0, 0, 'gameover-win');
            else
                this.bg = this.game.add.sprite(0, 0, 'gameover-lose');
            //

            this.transition.transitionAnimation = new GameBase.Transitions.Slide(this.game);

            if(this.win) // play credits
            {
                var credits:Phaser.Sprite = this.game.add.sprite(0, 0, 'gameover-credits');
                credits.alpha = 0;

                setTimeout(()=>{
                    
                    this.game.add.tween(credits).to(
                        {
                            alpha:1
                        },
                        300,
                        Phaser.Easing.Linear.None,
                        true
                    );
                    
                }, 1000 * 3);
            }
    	}

		render()
        {
            // this.game.debug.text('GAME OVER -- press F5 to play again', 35, 35);
        }
    }

}