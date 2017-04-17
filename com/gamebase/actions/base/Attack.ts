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