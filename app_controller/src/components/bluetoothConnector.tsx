import React from 'react';
import { Sprite } from '@inlet/react-pixi'
import ConnectButton from '../images/ConnectButton.png';

type BluetoothConnectorProps = {
    x: number,
    y: number,
    setCharacteristic: Function,
}

class BluetoothConnector extends React.Component<BluetoothConnectorProps>{
    
    private buttonProps = {
        height: 118,
        width: 118
    }

    connectToDevice() {
        let navigator: any = window.navigator
        var UUID = "8601cf7e-8291-4cb7-baef-cf570c53485f";
        navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices: [UUID]})
        .then((device: { gatt: { connect: () => any; }; }) => {
            console.log('Connecting to GATT Server...');
            return device.gatt.connect();
        })
        .then((server: { getPrimaryService: (arg0: string) => any; }) => {
            console.log("getting service");
            return(server.getPrimaryService(UUID));
        })
        .then((service: { getCharacteristic: (arg0: string) => any; }) => {
            console.log("Getting characteristics");
            return service.getCharacteristic('f2aec022-00ac-44b4-8158-07c48d2024c1');
        })
        .then((characteristic: any) => {
            console.log("getting characteristic");
            console.log(characteristic);
            this.props.setCharacteristic(characteristic);
        })
    }

    render(){
         return(<Sprite image={ConnectButton} {...this.buttonProps}  x={this.props.x} y={this.props.y} interactive={true} click={this.connectToDevice} />);
    }
}

export default BluetoothConnector;