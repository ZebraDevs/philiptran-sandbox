import { Sprite } from '@inlet/react-pixi'
import React from 'react';
import MiddleAreaImage from '../images/MiddleButtons.png';

// this script does nothing but add a border to the middle buttons :P 
type middleAreaProps = {
    x: number,
    y: number
}

class MiddleArea extends React.Component<middleAreaProps>{
    private propss = {
        width: 316,
        height:181
    }
    render(){
        return(<Sprite image={MiddleAreaImage} {...this.propss} x={this.props.x} y={this.props.y}/>);
    }
}

export default MiddleArea