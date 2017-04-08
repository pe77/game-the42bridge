/// <reference path='../../pkframe/refs.ts' />
 
module GameBase {
 
    export class Gaude extends Pk.PkElement {
        
        value:number;
        icons:Array<GameBase.Icon> = [];
        iconEven:boolean = true;

        padding:number = 5;

        addIcon(icon:GameBase.Icon):void
        {
            icon.create();
            // icon.animation.setFrame( this.iconEven ? 1 : 2);
            // this.iconEven = !this.iconEven;
            
            // save icon ref
            this.icons.push(icon);

            

            // add on gaude
            this.add(icon);

            // organize icons pos
            for (var i = 0; i < this.icons.length; i++)
                this.icons[i].x = (this.icons[i].width - this.padding) * i;
            //

            

            // console.log('add icon:', this.icons);
                
            // 
        }

    }
} 