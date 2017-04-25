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
            attackBg:Phaser.Sprite;

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
                
                // add bla
                this.addHealth(this.hero.healthMax);
                this.addEnergy(this.hero.energyMax);

                // pos 
                this.bg.y = this.hero.body.height;
                this.bg.anchor.x = .5;
                this.bg.x = this.hero.body.width / 2;

                this.healthGaude.x = this.bg.x - this.bg.width / 2;
                this.healthGaude.x += 65;
                this.healthGaude.y = this.bg.y + 40;
 
                this.energiGaude.x = this.healthGaude.x;
                this.energiGaude.y = this.healthGaude.y + this.gaudePadding;

                this.setAsInitialCords();

                this.hero.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);

                // hero end turn
                this.hero.event.add(GameBase.E.CharEvent.OnCharTurnMove,(t, turnMove)=>{
                    // if finish turn
                    if(turnMove)
                        this.heroDeselect();
                    //
                }, this);
            }

            addEnergy(v:number)
            {
                // check energy max 
                if(v+this.energiGaude.getVal() > this.hero.energyMax)
                    v =  this.hero.energyMax - this.energiGaude.getVal(); 
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
                for (var i = 0; i < v; i++) 
                    this.energiGaude.addIcon(new GameBase.GaudeIcon(this.game, energyIconKey), i*80);
                //

                this.hero.uiAttack.updateView();
            }

            addHealth(v:number)
            {
                // check energy max 
                if(v+this.healthGaude.getVal() > this.hero.energyMax)
                    v =  this.hero.healthMax - this.healthGaude.getVal(); 
                //

                // add heath icons
                for (var i = 0; i < v; i++) 
                    this.healthGaude.addIcon(new GameBase.GaudeIcon(this.game, 'heath-icon'), i*70);
                //

                this.hero.uiAttack.updateView();
            }

            removeEnergy(val:number)
            {
                this.energiGaude.subVal(val);

                this.hero.uiAttack.updateView();
            }

            getEnergy():number
            {
                return this.energiGaude.getVal();
            }


            removeHealth(val:number)
            {
                this.healthGaude.subVal(val);

                this.hero.uiAttack.updateView();
            }

            getHealth():number
            {
                return this.healthGaude.getVal();
            }


            setAsInitialCords()
            {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            }

            heroDeselect()
            {
                this.bg.loadTexture('ui-hero-'+this.hero.identification+'-off');
            }

            heroSelectd()
            {
                // if hero already move
                if(this.hero.turnMove)
                    return;
                //

                this.resetAttrs();
                this.bg.loadTexture('ui-hero-'+this.hero.identification+'-on');
            }

            inputOver()
            {
                // if hero already move
                if(this.hero.turnMove)
                    return;
                //

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