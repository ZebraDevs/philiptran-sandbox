// Handles connecting to bluetooth and sending files over BLE
// Renders a button to prompt user to connect to bluetooth device
// and an input field to upload a .bin file 

import React from 'react';

class FileHandler {
    // handles file loading and file sending over BLE

    private idx:number;
    private chunks:Array<ArrayBuffer>;
    private fileRef: any;

    constructor(fileRef: any) {
        this.idx = 0;
        this.chunks = [];
        this.fileRef = fileRef;
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
        // load the file stored in the 'input' element of BluetoothHandler
        let input = this.fileRef.current;
        let file = input.files[0];
        let fr = new FileReader(); 

        const processLoadedText = () => {
            let result = fr.result as ArrayBuffer; 
            console.log("sending first chunk!"); 

            // TEST VARS TO SEE HOW LONG PROCESSS TOOK! 

            var currentdate = new Date(); 
            var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
            console.log(datetime)

            if(result)
            {
                this.chunks = split(result);
                console.log(this.chunks);
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
        this.fileHandler = new FileHandler(this.fileRef);
    }

    render() {
        return ( 
            <>
            <button onClick = {this.connectToDevice.bind(this)}> Connnect </button> 
            <input type="file" ref={this.fileRef}></input>
            <button onClick={this.fileHandler.loadFile.bind(this)}> Upload </button>
            </>
        );
    }

    connectToDevice() {
        let navigator: any = window.navigator
        var UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
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
            return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
        })
        .then((_characteristic: any) => {
            console.log("getting characteristic");
            this.characteristic = _characteristic;
            // this._characteristic.addEventListener('characteristicvaluechanged',
            // send_next_bytes);
            console.log(this.characteristic);

            this.characteristic.startNotifications();
        })
    }

    sendFile(){

    }


}

function split(result:ArrayBuffer){

    let chunkSize = 511; // save 1 byte for our delimiter (max bytes is 512)
    let splitList = []; 
    let enc = new TextEncoder(); // used to encode our delimiters 

    while(result.byteLength > 0) {
        var chunk = result.slice(0, chunkSize);
        splitList.push(appendBuffer(chunk, enc.encode('|')));
        result = result.slice(511);
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