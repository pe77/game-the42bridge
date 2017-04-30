
module GameBase {
 
    export class Attack 
    {
        name:string;
        description:string;
        icon:GameBase.Icon;

        value:number;
        operator:GameBase.E.Operator;
        energyCost:number;
        energyType:E.EnergyType;

        constructor(game:Pk.PkGame, value:number, energyCost:number, operator:E.Operator, energyType:E.EnergyType, name:string = "Attack Name", description:string = "Attack description. Bla Bla Bla Bla", icon:GameBase.Icon = null)
        {
            // values
            this.name       = name;
            this.value      = value;
            this.energyCost = energyCost;
            this.operator   = operator;

            // meta info
            this.description    = description;
            this.icon           = icon;
            this.energyType     = energyType;
        }


        

    }

    export module E
    {
        export module AttackEvent
        {
            export const OnAttackResolve:string 	= "OnAttackResolve";
        }
    }
} 