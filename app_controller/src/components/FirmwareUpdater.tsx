import React from 'react';
import UploadButton from '../images/UploadButton.png';
import { Sprite } from '@inlet/react-pixi'

type FirmwareUpdaterProps = {
    x:number,
    y:number, 
    writeBLE:Function
}

class FirmwareUpdater extends React.Component<FirmwareUpdaterProps>{
    
    private fileReader: FileReader;
    
    private buttonProps = {
        height: 118,
        width: 118
    }

    private input: any;

    constructor(props:any){
        super(props);
        this.fileReader = new FileReader();

        // create our invisible input field to use in pixi
        this.input = document.createElement("input"); 
        this.input.type="file";
        this.input.onchange=this.loadFile.bind(this);
    }

    openFileSelector(){
        this.input.click();
    }

    render(){
        return(
            <>
            <Sprite image={UploadButton}  {...this.buttonProps} x={this.props.x} y={this.props.y} interactive={true} click={this.openFileSelector.bind(this)}/>
            </>
        );
        
    }

    loadFile(){
        let input = this.input;
        let file = input.files[0];
        this.fileReader.onload = this.processLoadedText.bind(this); 
        this.fileReader.readAsArrayBuffer(file); 
    }

    async processLoadedText(){
        let result = this.fileReader.result as ArrayBuffer; 
        if(result)
        {
            let splitData = this.split(result);
            let i = 0; 

            while(i < splitData.length){
                try{
                    await this.props.writeBLE(splitData[i]);
                    console.log(splitData[i])
                    i += 1;
                }
                catch(error){
                    console.log("GATT already in progress");
                }
            }

            let enc = new TextEncoder();
            await this.props.writeBLE(enc.encode("done"));

        }
    }

    split(result:ArrayBuffer){

        let chunkSize = 500; // save 1 byte for our delimiter (max bytes is 512)
        let splitList = []; 
        let enc = new TextEncoder(); // used to encode our delimiters 
    
        while(result.byteLength > 0) {
            result = result.slice(chunkSize);
            splitList.push(this.appendBuffer(result, enc.encode('|')));
        }
    
        // send over the bytelength of the final chunk to send to C side so it knows when 
        // all the chunks have been sent.
        splitList.unshift(enc.encode(""+splitList[splitList.length - 1].byteLength));
        return splitList;
    }

    appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
    };

}

export default FirmwareUpdater;