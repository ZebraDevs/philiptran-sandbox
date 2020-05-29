import React from 'react';
import RotateButton from './RotateButton';
import MovementButton from './MovementButton';
import MiddleButtons from './Middlebuttons';
import BluetoothConnector from './bluetoothConnector';
import FirmwareUpdater from './FirmwareUpdater';



type ControllerProps = {
    stageWidth:number, 
    stageHeight:number,
    writeBLE:Function,
    setCharacteristic: Function
}

type ControllerState = {
    rotateButtonX: number | undefined, // X position of the rotate button
    rotateButtonY: number | undefined, // Y position of the rotate button
    isMovingHorz: boolean,
    isMovingVert:boolean

    dir: number ,  
    moveButtonY: number | undefined, // Y position of our Move button
}

class Controller extends React.Component<ControllerProps, ControllerState>{
    
    constructor(props:any){
        super(props);
        this.state = {
            rotateButtonX: undefined,
            rotateButtonY: undefined,
            isMovingHorz: false,
            isMovingVert: false,
            dir: 48,
            moveButtonY: undefined
        }
    }

    updateRotateButtonPosition(newX:number, newY:number, newDir: number, intensity:number){
        this.sendDirectionCommand(newDir, intensity);
        this.setState({
            rotateButtonX: newX,
            rotateButtonY: newY,
            dir: newDir
        })
        
    }

    updateMoveButtonPosition(newY:number, newDir: number, intensity: number){

        this.sendDirectionCommand(newDir, intensity);
        this.setState({
            moveButtonY: newY,
            dir: newDir
        })
        
    }

    sendDirectionCommand(newDir:number, intensity: number){
        console.log("writing new direction: " + newDir)
        let enc:TextEncoder = new TextEncoder();
        this.props.writeBLE(enc.encode(""+(newDir + intensity)));
    }

    setHorzMovingStatus(newStatus:boolean){
        this.setState({
            isMovingHorz: newStatus
        })
    }

    setVertMovingStatus(newStatus: boolean){
        this.setState({
            isMovingVert: newStatus
        })
    }
    
    render(){
        return(
            <>
            <RotateButton 
                x={100}
                stageWidth={this.props.stageWidth} 
                stageHeight={this.props.stageHeight} // y cood is based on the stage height 
                buttonX = {this.state.rotateButtonX} 
                buttonY = {this.state.rotateButtonY} 
                isMoving = {this.state.isMovingHorz}
                updatePosition = {this.updateRotateButtonPosition.bind(this)}
                updateMovementStatus = {this.setHorzMovingStatus.bind(this)} 
            />
            <MiddleButtons x={350} y={180}/>
            <BluetoothConnector x={385} y={210} setCharacteristic={this.props.setCharacteristic}/>
            <FirmwareUpdater x={510} y={210} writeBLE={this.props.writeBLE}/>
            <MovementButton 
                x={700} 
                y={195} 
                isMoving={this.state.isMovingVert}
                setStatus={this.setVertMovingStatus.bind(this) }
                updatePosition={this.updateMoveButtonPosition.bind(this) }
                updatedY = {this.state.moveButtonY}
            />
            </>
        )
    }
}

export default Controller;