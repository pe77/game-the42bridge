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

            initialPosition:Phaser.Point;
            initialRotation:number;

            selectedTween:Phaser.Tween;

            constructor(game:Pk.PkGame, hero:GameBase.Hero)
            {
                super(game)

                this.hero = hero;

                this.hero.body.events.onInputOver.add(this.inputOver, this);
                this.hero.body.events.onInputOut.add(this.resetAttrs, this);
            }

            create()
            {
                // bg
                this.bg = this.game.add.sprite(0, 0, 'ui-hero-'+this.hero.identification+'-off');

                // gaudes
                this.healthGaude = new GameBase.Gaude(this.game);
                this.energiGaude = new GameBase.Gaude(this.game);

                // add on hero 
                this.add(this.bg);
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
                /*
                this.healthGaude.y = this.hero.body.height;
                this.energiGaude.y = this.healthGaude.y + (this.healthGaude.height / 4) + this.gaudePadding;
                
                this.healthGaude.y+= this.gaudeHeroPadding;
                this.energiGaude.y+= this.gaudeHeroPadding;
                */

                this.bg.y = this.hero.body.height;
                this.bg.anchor.x = .5;
                this.bg.x = this.hero.body.width / 2;

                this.healthGaude.x = this.bg.x - this.bg.width / 2;
                this.healthGaude.x += 65;
                this.healthGaude.y = this.bg.y + 40;

                this.energiGaude.x = this.healthGaude.x;
                this.energiGaude.y = this.healthGaude.y + this.gaudePadding;

                // pos bg
                // this.bg.y = this.healthGaude.y - 15;
                // this.bg.x -= 15;

                this.y += 45;

                this.initialPosition = new Phaser.Point(this.x, this.y);

                this.initialRotation = this.rotation;

                this.hero.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);

            }

            protected heroDeselect()
            {
                this.bg.loadTexture('ui-hero-'+this.hero.identification+'-off');
            }

            protected heroSelectd()
            {
                this.bg.loadTexture('ui-hero-'+this.hero.identification+'-on');
            }

            private inputOver()
            {
                this.y -= 10;
            }

            resetAttrs()
            {
                this.alpha = 1;
                this.x = this.initialPosition.x;
                this.y = this.initialPosition.y;
                this.rotation = this.initialRotation;
            }

            
        }
    }
} 