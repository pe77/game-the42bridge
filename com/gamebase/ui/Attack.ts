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

            audioOpen:Phaser.Sound;
            audioSelect:Phaser.Sound;

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
                    var bg = this.game.add.sprite(0, 0, 'ui-hero-attack-bg-' + this.hero.energyType);

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
                    
                    var attackBox:GameBase.AttackBox = new GameBase.AttackBox(this.game);

                    // add
                    attackBox.attack = attack;

                    attackBox.add(bg);   
                    attackBox.add(textValue);
                    attackBox.add(textEnergy);
                    attackBox.add(operatorIcon);

                    attackBox.setInputElement(bg);
                    attackBox.event.add(GameBase.E.AttackBoxEvent.OnAttackSelect, ()=>{
                        // if hero already move, ignore action
                        if(this.hero.turnMove)
                            return;
                        //

                        this.audioSelect.play();
                        
                        this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroAttackClick, attack);
                        this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
                    }, this)

                    this.attackBoxes.add(attackBox); 

                    // pos
                    attackBox.x = (bg.width+5) * i;

                    operatorIcon.x = bg.x + bg.width - 10;
                    operatorIcon.y -= 10;

                    textValue.x = operatorIcon.x + 2;
                    textValue.y = bg.y - 10;

                    textEnergy.x = bg.x + 17;
                    textEnergy.y = bg.y + bg.width - textEnergy.height + 10;
                });


                // input events
                reloadBox.inputEnabled = true;
                reloadBox.events.onInputDown.add(()=>{
                    
                    // if hero already move, ignore action
                    if(this.hero.turnMove)
                        return;
                    //

                    this.audioSelect.play();
                    
                    this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroReloadClick);
                    this.hero.event.dispatch(GameBase.E.HeroEvent.OnHeroDeselect);
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

                // audio
                this.audioOpen = this.game.add.audio('a-hero-menu');
                this.audioSelect = this.game.add.audio('a-hero-attack-selected');
            }

            setAsInitialCords()
            {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            }

            protected heroDeselect()
            {
                this.visible = false;
                this.hero.selected = false;
                
            }

            protected heroSelectd()
            {

                this.updateView();

                this.visible = true;
                this.resetAttrs();

                this.audioOpen.play();
            }

            updateView()
            {
                // check attack boxes avaliable
                this.attackBoxes.forEach((element)=>{

                    var attackBox:GameBase.AttackBox = <GameBase.AttackBox>element;

                    if(attackBox.attack.energyCost > this.hero.ui.getEnergy())
                    {
                        attackBox.alpha = 0.5;
                        attackBox.blockInput();
                    }else{
                        attackBox.alpha = 1;
                        attackBox.releaseInput();
                    }
                        
                }, this);
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