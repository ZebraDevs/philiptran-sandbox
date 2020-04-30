import React from 'react';
import { Stage } from '@inlet/react-pixi'
import Controller from './Controller';

type PIXIAppProps={
    writeBLE:Function ,
    setCharacteristic: Function,
    height: number,
    width: number
}

class PIXIApp extends React.Component<PIXIAppProps>{
    constructor(props:any) {
        super(props);
    }
    render(){
        let options = {
            backgroundColor: 0x232324
        }
        const _width = 1082;
        const _height = 500;

        return(
            <Stage width={_width} height={_height} options={options}> 
                <Controller stageWidth={_width} stageHeight={_height} writeBLE={this.props.writeBLE} setCharacteristic={this.props.setCharacteristic}/>
            </Stage>
        )
    }
}

export default PIXIApp;