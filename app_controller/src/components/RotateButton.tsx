import React from 'react';
import { Sprite } from '@inlet/react-pixi'
import Button from '../images/RotateButton.png';
import OuterRing from '../images/OuterRing.png';
import InnerCircle from '../images/InnerCircle.png';


type RotateButtonProps = {
    x:number,
    stageWidth:number, 
    stageHeight:number,
    buttonX: number|undefined,
    buttonY: number|undefined,
    isMoving: boolean,
    updatePosition: Function,
    updateMovementStatus: Function
}


class RotateButton extends React.Component<RotateButtonProps>{
    
    private innerButtonProps = {
        width: 163,
        height:156,
    }
    private outerRingProps = {
        width: 301,
        height: 301
    }
    private innerCircleProps = {
        width:142, 
        height:143
    }

    constructor(props:any){
        super(props);
    }

    moveButton(event:any){
        if(this.props.isMoving)
        {
            let newX:number = event.data.global.x;
            let newY:number = event.data.global.y;
            let movementdir: string = "STOP";
            let maxThreshholdX:number = (this.props.x - ((this.outerRingProps.width / 2) - (this.innerButtonProps.width/2) ) + this.outerRingProps.width)
            let minThreshholdX:number = (this.props.x - ((this.outerRingProps.width / 2) - (this.innerButtonProps.width/2) ));
            let maxThreshholdY:number = (this.props.stageHeight/2) - (this.innerCircleProps.height /2) + this.innerCircleProps.height;
            let minThreshholdY:number = (this.props.stageHeight/2) - (this.innerCircleProps.height);

            if(newX + this.innerButtonProps.width > maxThreshholdX){
                newX = (this.props.x - ((this.outerRingProps.width / 2) - (this.innerButtonProps.width/2) ) + this.outerRingProps.width) - this.innerButtonProps.width;
            }

            else if(newX < minThreshholdX){
                newX = (this.props.x - ((this.outerRingProps.width / 2) - (this.innerButtonProps.width/2) ));
            }

            if(newY  > maxThreshholdY){
                newY = (this.props.stageHeight/2) 
            } 
            else if(newY < minThreshholdY){
                newY = (this.props.stageHeight/2) - (this.innerCircleProps.height);
            }

            movementdir = newX > this.innerButtonProps.width/2 ? "RIGHT" : "LEFT";
            
            this.props.updatePosition(newX, newY, movementdir);
        }
        
    }

    startingMovement(){
        this.props.updateMovementStatus(true);
    }

    endingMovement(){
        this.props.updatePosition(this.props.x,(this.props.stageHeight/2) - (this.innerButtonProps.height /2), "STOP");
        this.props.updateMovementStatus(false);
    }
    
    render() {
        

        let innerButtonX = this.props.buttonX != undefined ? this.props.buttonX :  this.props.x 
        let innerButtonY = this.props.buttonY != undefined ?  this.props.buttonY  : (this.props.stageHeight/2) - (this.innerButtonProps.height /2) 

        return(
            <>
            <Sprite image={InnerCircle} {...this.innerCircleProps} x={this.props.x + ((this.innerButtonProps.width / 2) - (this.innerCircleProps.width/2) )} y={(this.props.stageHeight/2) - (this.innerCircleProps.height /2)  }/>
            <Sprite image={Button} {...this.innerButtonProps} x={innerButtonX} y={innerButtonY}/>
            <Sprite 
                image={OuterRing} {...this.outerRingProps} 
                x={this.props.x - ((this.outerRingProps.width / 2) - (this.innerButtonProps.width/2) )}
                y={(this.props.stageHeight/2) - (this.outerRingProps.height /2)  }
                interactive={true}
                pointerdown={this.startingMovement.bind(this)} 
                pointermove={this.moveButton.bind(this)}
                pointerup={this.endingMovement.bind(this)}
                pointerupoutside={this.endingMovement.bind(this)}
            />
            </>
        )
    }
}

export default RotateButton;