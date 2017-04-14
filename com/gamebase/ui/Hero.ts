/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export module ui
    {
        export class Hero extends Pk.PkElement
        {
            hero:GameBase.Hero;

            healthGaude:GameBase.Gaude;
            energiGaude:GameBase.Gaude;

            gaudePadding:number = 10;
            gaudeHeroPadding:number = 25;

            bg:Phaser.Sprite;

            op:Phaser.Sprite;
            

            constructor(game:Pk.PkGame, hero:GameBase.Hero)
            {
                super(game)

                this.hero = hero;

                this.hero.body.events.onInputOver.add(this.inputOver, this);
                this.hero.body.events.onInputOut.add(this.inputOut, this);
            }

            create()
            {
                // bg
                this.bg = this.game.add.sprite(0, 0, 'ui-hero-bg');

                // operator
                this.op = this.game.add.sprite(0, 0, 'ui-hero-'+this.hero.identification +'-op');

                // gaudes
                this.healthGaude = new GameBase.Gaude(this.game);
                this.energiGaude = new GameBase.Gaude(this.game);

                // add on hero 
                this.add(this.bg);
                this.add(this.op);
                this.add(this.healthGaude);
                this.add(this.energiGaude);

                // add heath icons
                for (var i = 0; i < this.hero.healthMax; i++) 
                    this.healthGaude.addIcon(new GameBase.Icon(this.game, 'heath-icon'));
                //

                // select energy icon
                var energyIconKey = '';
                switch (this.hero.energyType) {
                    case E.EnergyType.MANA:
                        energyIconKey = 'mana-icon';
                        break;

                    case E.EnergyType.STAMINA:
                        energyIconKey = 'stamina-icon';
                        break;
                }

                // add energy icons
                for (var i = 0; i < this.hero.energyMax; i++) 
                    this.energiGaude.addIcon(new GameBase.Icon(this.game, energyIconKey));
                //

                // pos gaudes
                this.healthGaude.y = this.hero.body.height;
                this.energiGaude.y = this.healthGaude.y + (this.healthGaude.height / 4) + this.gaudePadding;
                
                this.healthGaude.y+= this.gaudeHeroPadding;
                this.energiGaude.y+= this.gaudeHeroPadding;

                this.bg.y = this.healthGaude.y - 15;
                this.bg.x -= 15;

                this.op.anchor.set(0, .5)
                this.op.x = this.bg.width - this.op.width;
                this.op.y = this.bg.y;//  - 30;

                this.bg.animations.add('selected');//.play(10, true);

                // this.bg.setFrame(1);
                // this.bg.frame = 2;
                

                this.x = this.hero.body.width / 2 - this.width / 2;
                this.x += 10;
                this.y += 25;
            }

            private inputOver()
            {
                this.bg.animations.frame = 1;
                this.op.animations.frame = 1;
            }

            private inputOut()
            {
                this.bg.animations.frame = 0;
                this.op.animations.frame = 0;
            }

            
        }
    }
} 