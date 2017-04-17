/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export module ui
    {
        export class Attack extends Pk.PkElement
        {
            hero:GameBase.Hero;

            attackBg:Phaser.Sprite;
            attackBoxes:Pk.PkElement;

            initialPosition:Phaser.Point;
            initialRotation:number;

            textStyleValues:any = {
                font: "48px StrangerBack",
                fill: "#e5d4c5"
            };

            textStyleEnergy:any = {
                font: "32px StrangerBack",
                fill: "#fff"
            };

            constructor(game:Pk.PkGame, hero:GameBase.Hero)
            {
                super(game)

                this.hero = hero;
                this.attackBoxes = new Pk.PkElement(game);
            }

            create()
            {
                // bg
                this.attackBg = this.game.add.sprite(0, 0, 'ui-hero-attacks-bg-1');

                var reloadBox = this.game.add.sprite(0, 0, 'reload-box');

                this.hero.attacks.forEach((attack, i)=>{
                    
                    // bg
                    var bg = this.game.add.sprite(0, 0, 'ui-hero-attack-bg');

                    // value
                    var textValue = this.game.add.text(0, 0,
                        attack.value.toString(), // text
                        this.textStyleValues // font style
                    );
                    textValue.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
                    textValue.align = "right";
                    textValue.anchor.x = 1;

                    // energy
                    var textEnergy = this.game.add.text(0, 0,
                        attack.energyCost.toString(), // text
                        this.textStyleEnergy // font style
                    );
                    textEnergy.setShadow(3, 3, 'rgba(0,0,0,0.5)', 1);
                    textEnergy.align = "center";
                    textEnergy.anchor.x = 0.5;

                    // operator

                    var operatorIcon = this.game.add.sprite(0, 0, 'ui-hero-operator-' + attack.operator);
                    
                    // add
                    this.attackBoxes.add(bg);   
                    this.attackBoxes.add(textValue);
                    this.attackBoxes.add(textEnergy);
                    this.attackBoxes.add(operatorIcon);

                    // input events
                    this.attackBoxes.setAll('inputEnabled', true);
                    this.attackBoxes.setAll('input.useHandCursor', true);

                    // pos
                    bg.x = (bg.width+5) * i;

                    operatorIcon.x = bg.x + bg.width - 10;
                    operatorIcon.y -= 10;

                    textValue.x = operatorIcon.x + 2;
                    textValue.y = bg.y - 10;

                    textEnergy.x = bg.x + 17;
                    textEnergy.y = bg.y + bg.width - textEnergy.height + 10;
                });

                this.attackBoxes.x = this.attackBg.width / 2 - this.attackBoxes.width / 2;
                this.attackBoxes.y += 32;

                // reload box pos
                reloadBox.x = this.attackBg.x + this.attackBg.width - reloadBox.width;
                reloadBox.y = this.attackBg.y + this.attackBg.height;

                // add  
                this.add(this.attackBg);
                this.add(this.attackBoxes);
                this.add(reloadBox);
                
                this.setAsInitialCords();

                this.hero.event.add(GameBase.E.HeroEvent.OnHeroSelected, this.heroSelectd, this);
                this.hero.event.add(GameBase.E.HeroEvent.OnHeroDeselect, this.heroDeselect, this);

                this.visible = false;

            }

            setAsInitialCords()
            {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            }

            protected heroDeselect()
            {
                this.visible = false;
            }

            protected heroSelectd()
            {
                this.visible = true;
                this.resetAttrs();
                // this.bg.loadTexture('ui-hero-'+this.hero.identification+'-on');
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