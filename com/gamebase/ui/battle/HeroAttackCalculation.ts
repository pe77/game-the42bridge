
module GameBase {
 
    export class HeroAttackCalculation extends Pk.PkElement {
        
        attack:GameBase.Attack;
        enemy:GameBase.Enemy;
        hero:GameBase.Hero;

        textBg:Phaser.Sprite;
        bg:Phaser.Sprite;

        textBox:Phaser.Group;
        texts:Phaser.Group;

        attackText:Phaser.Text;
        resultText:Phaser.Text;

        lastValue:number;
        result:number;

        heroAttackBgs:Array<Phaser.Sprite> = []

        constructor(game:Pk.PkGame, attack:GameBase.Attack, enemy:GameBase.Enemy, hero:GameBase.Hero)
        {
            super(game);

            this.attack = attack;
            this.enemy = enemy;
            this.hero = hero;

            this.lastValue = this.enemy.lastValue;
            this.result = this.enemy.value;

            this.enemy.setValue(this.enemy.lastValue);
        }

        create()
        {
            this.textBox = this.game.add.group();

            // text bg
			this.textBg = this.game.add.sprite(0, 0, 'ui-hero-attack-calculate');

            // bg bg! // same world size
            this.bg = Pk.PkUtils.createSquare(this.game, this.game.world.width, this.game.world.height, "#000")
            this.bg.alpha = .3;

            // create hero bg attack animation 
            for (var i = 0; i < 3; i++) {
                var bg:Phaser.Sprite = this.game.add.sprite(0, 0, 'ui-hero-'+this.hero.identification+'-attack-' + (i+1));
                bg.anchor.set(.5, .5);
                bg.x += bg.width / 2;
                bg.y += bg.height / 2;

                this.heroAttackBgs.push(bg);
            }

            this.attackText = this.game.add.text(0, 0,
				'',
				{
					font: "108px StrangerBack",
					fill: "#833716"
				} // font style
			);

            this.resultText = this.game.add.text(0, 0,
				this.enemy.value.toString(), // text
				{
					font: "161px StrangerBack",
					fill: "#303f49"
				} // font style
			);

            this.texts = this.game.add.group();
            this.texts.add(this.attackText);
            this.texts.add(this.resultText);

            // text calcs
            this.updateCalcTexts();

            // pos
            this.updatePos()

            this.textBox.add(this.textBg);
            this.textBox.add(this.texts);
            
            this.add(this.bg);
            for (var i = 0; i < this.heroAttackBgs.length; i++) 
                this.add(this.heroAttackBgs[i]);
            //
            this.add(this.textBox);

            this.visible = false;
        }

        updatePos()
        {
            this.textBg.anchor.set(.5, .5);
            this.textBg.x = this.game.world.centerX;
            this.textBg.y = this.game.world.centerY;

            this.resultText.x = this.attackText.width + 2;
            this.resultText.y -= 20;

            this.texts.x =  this.textBg.x - this.texts.width/2 - 20;
            this.texts.y =  this.textBg.y - this.texts.height/2 + 55;
            this.texts.rotation -= 0.14;
        }

        updateCalcTexts()
        {
            var operator:string = '+';

            switch(this.attack.operator)
            {
                case GameBase.E.Operator.PLUS:
                    operator = '+';
                    break;

                case GameBase.E.Operator.MINU:
                    operator = '-';
                    break;

                case GameBase.E.Operator.DIVI:
                    operator = ' / ';
                    break;

                case GameBase.E.Operator.MULT:
                    operator = 'x';
                    break;
            }

            this.attackText.text = this.lastValue.toString()+operator+this.attack.value.toString()+'=';

            this.resultText.text = this.result.toString();
        }

        show()        
        {
            // hold value
            this.visible = true;

            var tween:Phaser.Tween = this.addTween(this).from(
                {
                    result:this.lastValue
                }, 
                2000,
                Phaser.Easing.Elastic.Out,
                false
            );

            tween.onUpdateCallback(()=>{

                // release value
                this.result = Math.round(this.result);

                // text calcs
                this.updateCalcTexts();
                
            }, this);

            tween.onComplete.add(()=>{
                
                this.enemy.setValue(this.result);

                var tweenBoxOut:Phaser.Tween = this.addTween(this.textBox).to(
                    {
                        x:this.textBox.x + 150,
                        alpha:0
                    }, 
                    200,
                    Phaser.Easing.Cubic.In,
                    true
                );

                for (let i = 0; i < this.heroAttackBgs.length; i++) 
                {
                    this.addTween(this.heroAttackBgs[i]).to(
                        {
                            alpha:0
                        }, 
                        200,
                        Phaser.Easing.Cubic.Out,
                        true
                    );
                }

                this.addTween(this.bg).to(
                    {
                        alpha:0
                    }, 
                    200,
                    Phaser.Easing.Cubic.Out,
                    true
                );

                tweenBoxOut.onComplete.add(()=>{
                    this.event.dispatch(GameBase.E.HeroAttackCalculation.End);
                    this.destroy();
                }, this);
                
            }, this);

            // anime boxs and back
            this.addTween(this.textBox).from(
                {
                    x:this.textBox.x - 150,
                    alpha:0
                }, 
                200,
                Phaser.Easing.Cubic.Out,
                true
            );

            this.addTween(this.bg).from(
                {
                    alpha:0
                }, 
                200,
                Phaser.Easing.Cubic.Out,
                true
            );

            tween.start();


            // attack animation
            for (let i = 0; i < this.heroAttackBgs.length; i++) 
            {
                this.addTween(this.heroAttackBgs[i]).from(
                    {
                        alpha:0
                    },
                    200,
                    Phaser.Easing.Linear.None,
                    true
                ).onComplete.add(()=>{

                    this.addTween(this.heroAttackBgs[i].scale).to(
                        {
                            x:1.1 + (i * 0.1),
                            y:1.1 + (i * 0.1)
                        },
                        2000,
                        Phaser.Easing.Linear.None,
                        true
                    )
                    
                }, this)
            }

        }
    }

    export module E 
    {
        export module HeroAttackCalculation
        {
            export const End:string 	= "HeroAttackCalculationEnd";
        }
    }

} 