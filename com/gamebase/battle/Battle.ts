
module GameBase {
 
    export class Battle 
    {    
        level:number;
        turn:number = 1;

        game:Pk.PkGame;
        state:Pk.PkState;

        heroes:Array<GameBase.Hero> = [];
        enemies:Array<GameBase.Enemy> = [];

        levelFlag:GameBase.LevelFlag;
        endTurnButton:GameBase.EndTurnButton;

        blockBg:Phaser.Sprite;

        event:Pk.PkEvent;

        finished:boolean = false;

        constructor(game:Pk.PkGame, state:Pk.PkState, level:number)
        {
            this.game = game;
            this.level = level;
            this.state = state;

            this.event = new Pk.PkEvent('element-event-battle', this);
        }

        create(uiLayerKey:string, blockLayerKey:string)
        {
            // level flag
            this.levelFlag = new GameBase.LevelFlag(this.game);
            this.levelFlag.create();

            // end turn button
            this.endTurnButton = new GameBase.EndTurnButton(this.game);
            this.endTurnButton.create();

            this.endTurnButton.event.add(GameBase.E.ButtonEvent.OnClick, ()=>{
                this.endTurn();
            }, this)

            // create a blank sprite for block input
			this.blockBg = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height);
			this.blockBg.alpha = 0;
			this.blockBg.inputEnabled = true;
            this.blockBg.visible = false;

            // add to layers
            this.state.addToLayer(uiLayerKey, this.levelFlag);
            this.state.addToLayer(uiLayerKey, this.endTurnButton);
            this.state.addToLayer(blockLayerKey, this.blockBg);
        }

        // init battle
        start()
        {
            // show level flag
            this.levelFlag.show(this.level);

            console.log('start battle level:', this.level)

            this.heroes.forEach(hero => {
                // show heroes
                hero.ui.visible = hero.visible = true;

                // set targets :: temp
                if(this.enemies.length)
                {
                    hero.target = this.enemies[0];
                    this.enemies[0].targets.push(hero);
                }

                // event handlers
                hero.event.add(GameBase.E.HeroEvent.OnHeroAttack, (event, a, e)=>{
                    this.checkEndBattle();
                }, this);
            });

            // show enemies
            this.enemies.forEach(enemy => {
                enemy.ui.visible = enemy.visible = true;

                enemy.event.add(GameBase.E.EnemyEvent.OnEnemyResolve, ()=>{
                    this.checkEndBattle();
                }, this);
            });

            // show turn button
            this.endTurnButton.in();

            this.event.add(GameBase.E.BattleEvent.OnEndTurn, this.nextTurn, this);
        }

        addHero(hero:GameBase.Hero)
        {
            hero.ui.visible = hero.visible = false;
            this.heroes.push(hero);
        }

        addEnemy(enemy:GameBase.Enemy)
        {
            enemy.ui.visible = enemy.visible = false;
            this.enemies.push(enemy);
        }  
        
        checkEndBattle()
        {
            if(this.finished)
            {
                console.log('ignore battle:', this.level)
                return;
            }
            
            var allEnemiesDie:boolean = true;
            for (var i = 0; i < this.enemies.length; i++)
            {
                if(this.enemies[i].alive)
                {
                    allEnemiesDie = false;
                    break;
                }
                    
            }

            if(allEnemiesDie)
            {
                // last param is win/lost battle
                this.endBattle(true);
                return;
            }

            var allHeroesDie:boolean = true;
            for (var i = 0; i < this.heroes.length; i++)
            {
                if(this.heroes[i].alive)
                {
                    allHeroesDie = false;
                    break;
                }
                    
            }

            if(allHeroesDie)
            {
                // last param is win/lost battle
                this.endBattle(false);
                return;
            }

        }

        endBattle(win:boolean)
        {
            // remove enemy hero target
            this.heroes.forEach(hero => {
                // hide heroes
                hero.visible = false;

                // remove hero target
                hero.target = null;

                // reset heroes move    
                hero.setTurnMove(false);
            });

            // remove enemies and heores
            for (var i = 0; i < this.enemies.length; i++)
            {
                this.enemies[i].destroy();
            }

            this.finished = true;

            // dispatch end battle event
            this.event.dispatch(GameBase.E.BattleEvent.OnBattleEnd, win);
            
            // block events
            this.event.clear();
            Pk.PkEvent.ignoreContext(this);
        }

        endTurn()
        {

            // hide end turn button
            this.endTurnButton.out();
            
            // enemies move
            this.enemiesMove();
            
            this.heroes.forEach(hero => {
                // check turn move for all
                hero.setTurnMove(true);

                hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
            });
           
        }


        nextTurn()
        {
            console.log('---- next turn ----')

            // reset moves
            this.enemies.forEach(enemy => {
                enemy.setTurnMove(false);
            });

            this.heroes.forEach(hero => {

                // if has health
                if(hero.ui.getHealth())
                    hero.setTurnMove(false);
                else
                    hero.dieResolve(); 
                //
            });

            // add turn counter
            this.turn++;

            // show turn end button
            this.endTurnButton.in();
        }

        enemiesMove()
        {
            // check if has any enemy
            if(!this.enemies.length)
            {
                this.event.dispatch(GameBase.E.BattleEvent.OnEndTurn);
                return;
            }

            for (var i = 0; i < this.enemies.length; i++) {
                var enemy:GameBase.Enemy = this.enemies[i];

                // if not move yet, attack
                if(!enemy.turnMove)
                {
                    // wait for atack and call next one
                    enemy.event.add(GameBase.E.EnemyEvent.OnEnemyResolve, ()=>{

                        // call next
                        this.enemiesMove();
                    }, this);

                    enemy.attack();

                    
                    return;
                }
                
            }

            // if all move
            this.event.dispatch(GameBase.E.BattleEvent.OnEndTurn);
        }

		reset()
		{

			// reset turn
			this.turn = 1

			// reset heroes

			// reset enemies 

		}     
        
    }

    export module E 
    {
        export module BattleEvent
        {
            export const OnBattleStart:string = "OnBattleStart";
            export const OnBattleEnd:string = "OnBattleEnd";
            export const OnEndTurn:string = "OnEndTurn";
        }
    }
} 