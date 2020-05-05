import React from 'react';
import { Sprite } from '@inlet/react-pixi'
import MovementButtonImage from '../images/MovementButton.png';
import MovementButtonOuterRing from '../images/MovementButtonOuterRing.png';


type MovementButtonProps = {
    x: number ,
    y: number , 
    isMoving: boolean,
    setStatus: Function,
    updatePosition: Function,
    updatedY: number | undefined
}

class MovementButton extends React.Component<MovementButtonProps>{

    private movementButtonProps = {
        width:119,
        height:119
    }

    private movementButtonOuterRingProp = {
        width: 159,
        height: 309
    }

    startMovement(){
        this.props.setStatus(true);
    }

    moveButton(event: any){
        let newY:number = event.data.global.y - 50 ;
        let yDifference:number = (this.movementButtonOuterRingProp.height / 2) - (this.movementButtonProps.height/2);

        if(this.props.isMoving){

            if(newY + this.movementButtonProps.height  > (this.props.y - yDifference) + this.movementButtonOuterRingProp.height ){
                newY = (this.props.y - yDifference) + this.movementButtonOuterRingProp.height  - this.movementButtonProps.height;
            }
            else if(newY < (this.props.y - yDifference)){
                newY = (this.props.y - yDifference);
            }
    
            let intensity = Math.abs((this.movementButtonOuterRingProp.height/2) - (newY - (this.movementButtonProps.width / 2) )) / (this.movementButtonOuterRingProp.height/2);
            intensity = Math.min(intensity, .99);
            if(newY - 30 <  (this.movementButtonOuterRingProp.height/2)  ){
                this.props.updatePosition( newY, "U", intensity);
            }
            else
            {
                this.props.updatePosition( newY, "DOWN", intensity);
            }
        }
    }

    stopMovement(){
        this.props.updatePosition( this.props.y, 48, 0);
        this.props.setStatus(false);
    }

    render() {

        let xDifference:number = (this.movementButtonOuterRingProp.width / 2) - (this.movementButtonProps.width / 2);
        let yDifference:number = (this.movementButtonOuterRingProp.height / 2) - (this.movementButtonProps.height/2);
        let updatedY = this.props.updatedY !== undefined ? this.props.updatedY : this.props.y 
        
        return(
            <>
                <Sprite image={MovementButtonOuterRing} {...this.movementButtonOuterRingProp} x={this.props.x - xDifference} y={this.props.y - yDifference}/>
                <Sprite image={MovementButtonImage} 
                {...this.movementButtonProps} 
                x={this.props.x} 
                y={updatedY}
                interactive={true}
                pointerdown={this.startMovement.bind(this)} 
                pointermove={this.moveButton.bind(this)}
                pointerup={this.stopMovement.bind(this)}
                pointerupoutside={this.stopMovement.bind(this)}
                />
            </>
        );
    }
}

export default MovementButton;