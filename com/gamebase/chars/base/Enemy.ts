/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
 
module GameBase {
 
    export class Enemy extends GameBase.Char {
        
        ui:GameBase.ui.Enemy;
        identification:number = 0;
        value:number = 0;
        lastValue:number = 0;

        level:number = 1;

        targets:Array<GameBase.Hero> = [];

        static enemies:Array<GameBase.Enemy> = [];

        audioDie:Phaser.Sound;
        audioAttack:Phaser.Sound;
        audioTakingDamage:Phaser.Sound;

        constructor(game, body, id, value)
        {
            super(game, body);
            this.ui = new GameBase.ui.Enemy(this.game, this);
            this.identification = id;
            this.lastValue = this.value = value;

            GameBase.Enemy.enemies.push(this);
        }

        create()
        {
            super.create();
            this.ui.create();

            // attack resolve handler
            this.event.add(GameBase.E.AttackEvent.OnAttackResolve, (target, h, a)=>{
                var hero:GameBase.Hero = <GameBase.Hero>h;
                var attack:GameBase.Attack = <GameBase.Attack>a;

                this.resolveAttack(hero, attack)

            }, this);

            // audio
            this.audioDie = this.game.add.audio('a-enemy-die');
            this.audioAttack = this.game.add.audio('a-enemy-attack');
            this.audioTakingDamage = this.game.add.audio('a-enemy-taking-damage');

        }

        resolveAttack(hero:GameBase.Hero, attack:GameBase.Attack)
        {
            console.log('hero['+hero.name+'] attack [' + this.name + ']');

            switch(attack.operator)
            {
                case GameBase.E.Operator.PLUS:
                    this.setValue(this.value + attack.value);
                    break;

                case GameBase.E.Operator.MINU:
                    this.setValue(this.value - attack.value);
                    break;

                case GameBase.E.Operator.DIVI:
                    this.setValue(this.value / attack.value);
                    break;

                case GameBase.E.Operator.MULT:
                    this.setValue(this.value * attack.value);
                    break;
            }

            // check if die
            if(this.value == 42)
                this.die(false);
            // 
                

        }

        playDeadAnimation(dispatchDieEvent:boolean = true)
        {
            this.currentAnimation.animation.stop();
            //

            // "remove" ui
            this.addTween(this.ui).to({alpha:0, y:-15}, 100).start();

            var step = {v:0};
            var t:Phaser.Tween = this.addTween(step).to(
                {
                    v:100
                },
                400,
                Phaser.Easing.Default,
                true
            );
            // tint to black
            var startColor = 0xffffff;
            var endColor = 0x000000;
            t.onUpdateCallback(()=>{
                this.currentAnimation.sprite.tint = Phaser.Color.interpolateColor(startColor, endColor,100, step.v);
            }, this);

            // bug fix
            t.onComplete.add(()=>{
                this.currentAnimation.sprite.tint = endColor;
            }, this);


            // final value text
            var finalText = this.game.add.text(0, 0, 
                this.value.toString(), 
                {
					font: "138px StrangerBack",
					fill: "#edddd0"
				}
            )

            // pos / add
            finalText.anchor.set(.5, .5);
            finalText.x = this.body.width / 2;
            finalText.y = this.body.height / 2;
            this.add(finalText);
            finalText.scale.set(3, 3);
            
            // splash nunber
            this.addTween(finalText.scale).to(
                {
                    x:1,
                    y:1,
                },
                600,
                Phaser.Easing.Elastic.Out,
                true
            ).onComplete.add(()=>{

                // camera shake
                this.game.camera.shake(0.03, 100);

                // play fx
                this.audioDie.play('', 0, 0.3)

                this.addTween(this).to(
                    {alpha:0},
                    300, 
                    Phaser.Easing.Default,
                    true
                ).onComplete.add(()=>{
                    
                    // dispatch dead event
                    if(dispatchDieEvent)
                        this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyDieAnimationEnd);
                    //

                    this.destroy();
                }, this)
            }, this);

        }

        die(playDeadAnimation:boolean = true)
        {
            // set as dead
            this.alive = false;

            if(playDeadAnimation)
            {
                this.playDeadAnimation(true);
                return;
            }

            // dispatch dead event
            this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyDie);
        }

        attack()
        {
            this.setTurnMove(true);

            // attack only living heroes
            var standHeroes:Array<GameBase.Hero> = [];

            this.targets.forEach(hero=>{

                // check if is alive
                if(hero.ui.getHealth())
                    standHeroes.push(hero);
                //
            });

            // if all heroes die, pass turn
            if(!standHeroes.length)
            {
                // wait a little time
                setTimeout(()=>{
                    this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyResolve);
                }, 1500)
                return;
            }

            // select a random hero
            var hero:GameBase.Hero = standHeroes[this.game.rnd.integerInRange(0, standHeroes.length-1)];
            
            var damage:number = this.game.rnd.integerInRange(1, (this.level+2));
            var damageType:number;

            // calcule hero DR
            damage -= hero.damageReduction;
            damage = damage <= 0 ? 1 : damage;

            // damage = 5;// temp

            // sort damage type
            switch(this.game.rnd.integerInRange(1, 5))
            {
                case 1:
                case 2:
                case 3:
                case 4:
                    damageType = GameBase.E.AttackType.HEATH;
                    break;
                
                case 5:
                    damageType = GameBase.E.AttackType.ENERGY;
                    break;
            }

            // for now all damage on health
            damageType = GameBase.E.AttackType.HEATH;

            // if hero has no energy, change type to heath
            if(
                damageType == GameBase.E.AttackType.ENERGY
                && 
                hero.ui.getEnergy() <= 0
            )
            {
                damageType = GameBase.E.AttackType.HEATH;
            }

            // cause a random damage
            hero.event.dispatch(GameBase.E.AttackEvent.OnAttackResolve, this, damage, damageType);

            // play claw animation
            var clawAnimation:GameBase.EnemyClawDamage = new GameBase.EnemyClawDamage(this.game, this, hero);
            clawAnimation.create();

            // pos on hero body
            clawAnimation.x = hero.x - 10;
            clawAnimation.show();

            // play attack audio
            this.audioAttack.play('', 0, 0.6);

            clawAnimation.event.add(GameBase.E.EnemyClawDamage.OnEnd, ()=>{
                this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyResolve, damage, damageType, hero);
            }, this);

            // wait a little and dispatch event
            setTimeout(()=>{
                // this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyResolve, damage, damageType, hero);
            }, 1500)
        }

        setValue(v:number)
        {
            this.lastValue = this.value;
            this.value = Math.round(v);
            this.ui.updateValue();
        }

        destroy()
        {
            // destroy ui
            this.ui.destroy();

            // remove enemies
            this.targets = [];

            super.destroy();
        }

    }

    export module E
    {
        export module EnemyEvent
        {
            export const OnEnemySelected:string 	= "OnEnemySelected";
            export const OnEnemyDeselect:string 	= "OnEnemyDeselect";
            export const OnEnemyResolve:string 	    = "OnEnemyResolve";
            export const OnEnemyDie:string 	        = "OnEnemyDie";
            export const OnEnemyDieAnimationEnd:string 	        = "OnEnemyDieAnimationEnd";
        }

        export enum AttackType
        {
            HEATH,
            ENERGY
        }
    }
} 