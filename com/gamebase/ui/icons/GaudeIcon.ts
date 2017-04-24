 
module GameBase {
 
    export class GaudeIcon extends GameBase.Icon {
        
        inOutTime:number = 300;

        in(delay:number = 0)
        {
            this.addTween(this).from(
                {
                    alpha:0,
                    x:this.x + 20,
                    y:this.y - 10,
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.In,
                true,
                delay
            )
        }

        out(delay:number = 0)
        {
            
            var tween:Phaser.Tween = this.addTween(this).to(
                {
                    alpha:0,
                    y:this.y - 10,
                }, 
                this.inOutTime, 
                Phaser.Easing.Back.Out,
                false,
                delay
            );

            tween.onComplete.add(()=>{
                this.destroy();
            }, this);

            tween.start();
        }

    }
} 