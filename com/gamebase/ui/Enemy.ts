/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export module ui
    {
        export class Enemy extends Pk.PkElement
        {
            enemy:GameBase.Enemy;

            initialPosition:Phaser.Point;
            initialRotation:number;

            bg:Phaser.Sprite;

            textStyleValues:any = {
                font: "58px StrangerBack",
                fill: "#643b35"
            };

            textValue:Phaser.Text;

            constructor(game:Pk.PkGame, enemy:GameBase.Enemy)
            {
                super(game)

                this.enemy = enemy;

            }

            create()
            {
                // bg
                this.bg = this.game.add.sprite(0, 0, 'ui-enemy-value-bg');

                // value
                this.textValue = this.game.add.text(0, 0,
                    this.enemy.value.toString(), // text
                    this.textStyleValues // font style
                );
                this.textValue.align = "center";
                this.textValue.anchor.set(0.5);

                this.textValue.x = this.bg.width / 2;
                this.textValue.y = this.bg.height / 2;


                // add 
                this.add(this.bg);
                this.add(this.textValue);

                // pos
                this.updatePosition();
            }

            updatePosition()
            {
                // put on head 
                this.x = this.enemy.x;
                this.y = this.enemy.y - this.height;

                this.setAsInitialCords();
            }

            updateValue()
            {
                this.textValue.text = this.enemy.value.toString();
            }


            setAsInitialCords()
            {
                this.initialPosition = new Phaser.Point(this.x, this.y);
                this.initialRotation = this.rotation;
            }
            
        }
    }
} 