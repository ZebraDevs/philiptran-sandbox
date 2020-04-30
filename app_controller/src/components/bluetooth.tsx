import React from 'react';
import PIXIApp from './PixiApp';

class Bluetooth extends React.Component { 
    private BLECharacteristic : any;

    constructor(props : any){
        super(props);
        this.writeBLE = this.writeBLE.bind(this);
        this.setCharacteristic = this.setCharacteristic.bind(this);
    }

    async writeBLE(value: ArrayBuffer){
        await this.BLECharacteristic.writeValue(value);
    }

    setCharacteristic(_BLECharacteristic:any){
        this.BLECharacteristic = _BLECharacteristic;
    }

    getBLECharacteristic(){
        if(this.BLECharacteristic == undefined){
            alert("Please connect device to bluetooth!");
            return;
        }
        console.log(this.BLECharacteristic);
        return(this.BLECharacteristic);
    }

    render(){
        return(
            <div>
                <PIXIApp setCharacteristic={this.setCharacteristic} writeBLE={this.writeBLE} height={500} width={500}/>
            </div>
        )
    }
}

export default Bluetooth;