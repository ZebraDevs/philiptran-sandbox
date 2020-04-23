
class chunk_loader{
    idx:number;
    chunks:Array<number>;

    constructor(){
        this.idx = 0;
        this.chunks = [];
    }

    add_chunks(chunks){
        this.chunks = chunks;
    }

    next_chunk(){
        return(this.chunks[this.idx++]);
    }

    get_idx(){
        return(this.idx);
    }

    hasNext(){
        return(this.idx < this.chunks.length);
    }

    write_chunk(to_write) {
        return(characteristic.writeValue(to_write))
        .catch(error => this.write_chunk(to_write))
    }
}

let loader = new chunk_loader();
var characteristic = null;
var descriptor = null;

function setup(){

    var bluetooth_connect_btn = document.createElement("BUTTON");
    bluetooth_connect_btn.innerHTML = "CONNECT";
    bluetooth_connect_btn.onclick = connect_to_device;
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(bluetooth_connect_btn);

    var form = document.createElement("FORM");
    form.onsubmit = function(){return false;}
    document.body.appendChild(form);

    var file_input = document.createElement("input");
    file_input.type = "file"
    file_input.id = "fileinput";

    var load_file_button =  document.createElement("BUTTON");
    load_file_button.id = "btnLoad";
    load_file_button.innerHTML = "UPLOAD";
    load_file_button.onclick = load_file;

    form.appendChild(file_input);
    form.appendChild(load_file_button);


}


function connect_to_device() {
    var UUID = "8601cf7e-8291-4cb7-baef-cf570c53485f";

    let navigator: any = window.navigator
    navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices: [UUID]})
    .then(device => {
        console.log('Connecting to GATT Server...');
        return device.gatt.connect();
    })
    .then(server => {
        console.log("getting service");
        return(server.getPrimaryService(UUID));
    })
    .then(service => {
        console.log("Getting characteristics");
        return service.getCharacteristic('f2aec022-00ac-44b4-8158-07c48d2024c1');
    })
    .then(_characteristic => {
        console.log("getting characteristic");
        characteristic = _characteristic;
        // characteristic.startNotifications();
        // characteristic.addEventListener('characteristicvaluechanged',
        // send_next_bytes);
        console.log(characteristic);
        let error = document.getElementById("error_msg");
        error.innerHTML = "Connected successfully! You can now vroom vroom the robot";
    })
    .catch( err => {
        let error = document.getElementById("error_msg");
        error.innerHTML = "Failed to connect successfully! Please try again: " + err;
    })
}

var d1;
var d2;

async function send_next_bytes(event) { 

    var enc = new TextEncoder();

    if(!loader.hasNext()){
        console.log("all done!")
        
        loader.write_chunk(enc.encode("done"))
        d2 = new Date() 
        console.log("Took: " + ((d2.getTime() - d1.getTime())/1000) )
        return
    }
    console.log("sending next: ")
    var to_write = loader.next_chunk();
    console.log(to_write)
    
    await loader.write_chunk(to_write);
}

function load_file() {
    var input, file, fr;

    input = document.getElementById('fileinput');
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsArrayBuffer(file);

    async function receivedText() {
        var result = fr.result;

        // for printing time sending file took
        console.log("sending first chunk");
        d1 = new Date(); 
        let res = listify(result)

        for(var i = 0; i < res.length; i++){
            let d3 = new Date();
            await characteristic.writeValue(res[i])
            let d4 = new Date();
            console.log("Took: " + ((d4.getTime() - d3.getTime())) )
        }
        let enc = new TextEncoder();
        await characteristic.writeValue(enc.encode("done"))
        d2 = new Date();
        console.log("Took Overall: " + ((d2.getTime() - d1.getTime())/1000) )
        // loader.add_chunks(listify(result));
        // await characteristic.writeValue(loader.next_chunk());

    }
}



function listify(result) {
    //split into 512 byte sized chunks
    var l = []

    var enc = new TextEncoder();
    
    while(result.byteLength > 0){
        var chunk = result.slice(0,500)

        l.push(_appendBuffer(chunk, enc.encode('|')))

        result = result.slice(500)
    }

    l.unshift(enc.encode(l[l.length - 1].byteLength))

    console.log("CHUNKS TO WRITE: " + l.length)

    return l
}

function _appendBuffer(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  };

setup();

