// Handles connecting to bluetooth and sending files over BLE
// Renders a button to prompt user to connect to bluetooth device
// and an input field to upload a .bin file 

import React from 'react';

class FileHandler {
    // handles file loading and file sending over BLE

    private idx:number;
    private chunks:Array<ArrayBuffer>;
    private fileRef: any;
    private characteristic: any;

    constructor(fileRef: any, characteristic: any) {
        this.idx = 0;
        this.chunks = [];
        this.fileRef = fileRef;
        this.characteristic = characteristic;
    }

    set(chunks:Array<ArrayBuffer>) {
        this.idx = 0;
        this.chunks = chunks;
    }

    nextChunk() {
        return(this.chunks[this.idx++]);
    }

    getIdx() {
        return(this.idx);
    }

    hasNext() {
        return(this.idx < this.chunks.length);
    }

    loadFile() {
        // load the file stored in the 'input' element of BluetoothHandler and send it
        let input = this.fileRef.current;
        let file = input.files[0];
        let fr = new FileReader(); 

        const processLoadedText = async () => {
            let result = fr.result as ArrayBuffer; 

            if(result)
            {
                this.chunks = split(result);
                
                for(var i = 0; i < this.chunks.length; i++) {
                    await this.characteristic.writeValue(this.chunks[i]);
                }
                let enc = new TextEncoder();
                await this.characteristic.writeValue(enc.encode("done"))
            }
        }

        fr.onload = processLoadedText.bind(this); 
        fr.readAsArrayBuffer(file); 
    }

}

class BluetoothHandler extends React.Component {

    private characteristic: any;
    private fileHandler: FileHandler;
    private fileRef: any;

    constructor(props: any) {
        super(props); 
        this.characteristic = null;
        this.fileRef = React.createRef();
        this.fileHandler = new FileHandler(this.fileRef, this.characteristic);
    }

    render() {
        return ( 
            <>
            <div className="flex-container">
                <div id ="item">
                    <button id="button" onClick = {this.connectToDevice.bind(this)}> Connnect </button> 
                </div>
                <div id = "item">
                    <button id="button" onClick={this.fileHandler.loadFile.bind(this)}> Upload </button>
                </div>
                <div id = "item">
                    <input type="file" ref={this.fileRef}></input>
                </div>
                
            </div>
            </>
        );
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
        .then((_characteristic: any) => {
            console.log("getting characteristic");
            this.characteristic = _characteristic;
            console.log(this.characteristic);

        })
    }

    sendFile(){

    }


}


// helper functions
// TODO: move to non-class specific file
function split(result:ArrayBuffer){

    let chunkSize = 500; // save 1 byte for our delimiter (max bytes is 512)
    let splitList = []; 
    let enc = new TextEncoder(); // used to encode our delimiters 

    while(result.byteLength > 0) {
        var chunk = result.slice(0, chunkSize);
        splitList.push(appendBuffer(chunk, enc.encode('|')));
        result = result.slice(chunkSize);
    }

    // send over the bytelength of the final chunk to send to C side so it knows when 
    // all the chunks have been sent.
    splitList.unshift(enc.encode(""+splitList[splitList.length - 1].byteLength));
    return splitList;
}

function  appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
};

export default BluetoothHandler;