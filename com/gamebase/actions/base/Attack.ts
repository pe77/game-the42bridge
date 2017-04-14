/// <reference path='../../../pkframe/refs.ts' />
 
module GameBase {
 
    export class Attack extends Pk.PkElement 
    {
        description:string;
        icon:GameBase.Icon;

        value:number;
        operator:GameBase.E.Operator;
        energyCost:number;
        energyType:E.EnergyType;



        // UI 
        initialPos:Phaser.Point;

        iconPadding:number = 10;
        textPadding:number = 1;
        bgPadding:number = 10;

        textName:Phaser.Text;
        textDescription:Phaser.Text;
        textValue:Phaser.Text;
        textEnergy:Phaser.Text;

        textStyleName:any = {
			font: "18px Arial",
            fill: "#fff"
        };

        textStyleDescription:any = {
			font: "12px Arial",
            fill: "#fff"
        };

        textStyleValues:any = {
			font: "22px Arial",
            fill: "#fff"
        };

        energyTypeIcon:Icon;

        textBg:Phaser.Sprite;
        iconBg:Phaser.Sprite;
        energyBg:Phaser.Sprite;
        valueBg:Phaser.Sprite;

        sizeWidth:number;

        constructor(game:Pk.PkGame, value:number, energyCost:number, operator:E.Operator, energyType:E.EnergyType, name:string = "Attack Name", description:string = "Attack description. Bla Bla Bla Bla", icon:GameBase.Icon = null)
        {
            super(game);

            // values
            this.value      = value;
            this.energyCost = energyCost;
            this.operator   = operator;

            // meta info
            this.name           = name;
            this.description    = description;
            this.icon           = icon;
            this.energyType     = energyType;
        }

        create()
        {
            this.icon.create(false);

            // TEXTS

            // create attack text :: name
            this.textName = this.game.add.text(0, 0,
				this.name, // text
                this.textStyleName // font style
            );
            this.textName.align = "left";

            // create attack text :: description
            this.textDescription = this.game.add.text(0, 0,
				this.description, // text
                this.textStyleDescription // font style
            );
            this.textDescription.align = "left";

            // create attack text :: value
            this.textValue = this.game.add.text(0, 0,
				this.value.toString(), // text
                this.textStyleDescription // font style
            );
            this.textValue.align = "left";

            // create attack text :: energy
            this.textEnergy = this.game.add.text(0, 0,
				this.energyCost.toString(), // text
                this.textStyleDescription // font style
            );
            this.textEnergy.align = "left";


            // ICONS

            // select energy icon
            var energyIconKey = '';
            switch (this.energyType) {
                case E.EnergyType.MANA:
                    energyIconKey = 'mana-icon';
                    break;

                case E.EnergyType.STAMINA:
                    energyIconKey = 'stamina-icon';
                    break;
            }

            this.energyTypeIcon        = new GameBase.Icon(this.game, energyIconKey);
            // this.energyTypeIcon.create(false);
            // this.energyTypeIcon.playAnimation(8);

            var operatorIcon        = new GameBase.Icon(this.game, 'operator-icon-' + this.operator);
            // operatorIcon.create(false);
            // operatorIcon.playAnimation(10);

            // POS

            this.textName.x         = this.icon.width + this.iconPadding;
            
            this.textDescription.x  = this.textName.x;
            this.textDescription.y  = this.textName.height + this.textPadding;

            this.textValue.x        = this.textName.x;
            this.textValue.y        = this.textName.y - this.textValue.height - this.textPadding;

            this.energyTypeIcon.x       = this.textDescription.x + this.textDescription.width - this.textEnergy.width;
            this.energyTypeIcon.x       = this.textDescription.width < this.textName.width ? this.textName.x + this.textName.width - this.textEnergy.width : this.energyTypeIcon.x;
            this.energyTypeIcon.y       = this.textValue.y;

            this.textEnergy.x       = this.energyTypeIcon.x - this.textEnergy.width - this.iconPadding/2;
            this.textEnergy.y       = this.textValue.y;

            operatorIcon.x          = this.textValue.x + this.textValue.width + this.iconPadding/2;
            operatorIcon.y          = this.textValue.y;

            this.sizeWidth              = this.textName.width > this.textDescription.width ? this.textName.width : this.textDescription.width;

            // bgs
            this.textBg = Pk.PkUtils.createSquare(this.game, this.sizeWidth + this.bgPadding, this.textName.y + this.textName.height + this.textDescription.height + this.bgPadding);
            this.textBg.x = this.textName.x - this.bgPadding/2;
            this.textBg.y = this.textName.y - this.bgPadding/2;
            this.textBg.alpha = .3;

            this.iconBg = Pk.PkUtils.createSquare(this.game, 
                this.icon.width + this.bgPadding,  // x
                this.icon.height + this.bgPadding // y
            );
            this.iconBg.x = this.icon.x - this.bgPadding/2;
            this.iconBg.y = this.icon.y - this.bgPadding/2;
            this.iconBg.alpha = .3;

            this.energyBg = Pk.PkUtils.createSquare(this.game, 
                this.textEnergy.width + operatorIcon.width + (this.iconPadding/2) + this.bgPadding,  // x
                operatorIcon.height + this.bgPadding // y
            );
            this.energyBg.x = this.textEnergy.x - this.bgPadding/2;
            this.energyBg.y = this.textEnergy.y - this.bgPadding/2;
            this.energyBg.alpha = .3;

            this.valueBg = Pk.PkUtils.createSquare(this.game, 
                this.textValue.width + this.energyTypeIcon.width + (this.iconPadding/2) + this.bgPadding,  // x
                this.energyTypeIcon.height + this.bgPadding // y
            );
            this.valueBg.x = this.textValue.x - this.bgPadding/2;
            this.valueBg.y = this.textValue.y - this.bgPadding/2;
            this.valueBg.alpha = .3;



            // add elements
            this.add(this.valueBg);
            this.add(this.energyBg);
            this.add(this.iconBg);
            this.add(this.textBg);
            this.add(this.icon);
            this.add(this.textName);
            this.add(this.textDescription);
            this.add(this.textValue);
            this.add(this.textEnergy);
            this.add(this.energyTypeIcon);
            this.add(operatorIcon);

            
            

            this.visible = false;
        }

        show(delay:number)
        {
            this.visible = true;

            // save initial pos | one time only
            if(!this.initialPos)
                this.initialPos = new Phaser.Point(this.x, this.y);
            //

            this.alpha = 1;
            this.addTween(this).from(
                {
                    alpha:0
                }, 
                200, 
                Phaser.Easing.Back.In,
                true,
                delay
            )  

            

            this.position.y = this.initialPos.y;
            this.addTween(this).from(
                {
                    y:this.initialPos.y + 50
                }, 
                500, 
                Phaser.Easing.Cubic.Out,
                true,
                delay
            )
        }
    }
} 