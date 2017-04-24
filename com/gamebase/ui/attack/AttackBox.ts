
module GameBase {
 
    export class AttackBox extends Pk.PkElement {
        
        attack:GameBase.Attack;
        inputElement:Phaser.Sprite;

        setInputElement(sprite:Phaser.Sprite)
        {
            this.inputElement = sprite;

            this.releaseInput();
            this.inputElement.events.onInputDown.add(()=>{
                this.event.dispatch(GameBase.E.AttackBoxEvent.OnAttackSelect);
            }, this);
        }

        blockInput()
        {
            this.inputElement.inputEnabled = false;
            this.inputElement.input.useHandCursor = false;
        }

        releaseInput()
        {
            this.inputElement.inputEnabled = true;
            
        }

    }

    export module E 
    {
        export module AttackBoxEvent
        {
            export const OnAttackSelect:string 	= "OnAttackSelect";
        }
    }
} 