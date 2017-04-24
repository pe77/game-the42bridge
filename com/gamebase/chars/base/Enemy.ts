/// <reference path='../../../pkframe/refs.ts' />
/// <reference path='./Char.ts' />
 
module GameBase {
 
    export class Enemy extends GameBase.Char {
        
        ui:GameBase.ui.Enemy;
        identification:number = 0;
        value:number = 0;

        level:number = 1;

        targets:Array<GameBase.Hero> = [];

        static enemies:Array<GameBase.Enemy> = [];

        constructor(game, body, id, value)
        {
            super(game, body);
            this.ui = new GameBase.ui.Enemy(this.game, this);
            this.identification = id;
            this.value = value;

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
            if(!standHeroes)
            {
                // wait a little time
                setTimeout(()=>{
                    this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyResolve);
                }, 1500)
                return;
            }


            // select a random hero
            var hero:GameBase.Hero = standHeroes[this.game.rnd.integerInRange(0, standHeroes.length-1)];
            
            var damage:number = this.game.rnd.integerInRange(1, (this.level*2));
            var damageType:number;

            damage = 5;// temp

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

            
            // wait a little and dispatch event
            setTimeout(()=>{
                this.event.dispatch(GameBase.E.EnemyEvent.OnEnemyResolve);
            }, 1500)

            
            
        }

        setValue(v:number)
        {
            
            this.value = Math.floor(v);
            this.ui.updateValue();
        }

    }

    export module E
    {
        export module EnemyEvent
        {
            export const OnEnemySelected:string 	= "OnEnemySelected";
            export const OnEnemyDeselect:string 	= "OnEnemyDeselect";
            export const OnEnemyResolve:string 	= "OnEnemyResolve";
        }

        export enum AttackType
        {
            HEATH,
            ENERGY
        }
    }
} 