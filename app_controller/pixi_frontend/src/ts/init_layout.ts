
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
let characteristic = null;

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
    var UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";

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
        return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
    })
    .then(_characteristic => {
        console.log("getting characteristic");
        characteristic = _characteristic;
        characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged',
        send_next_bytes);
        console.log(characteristic);
    })
}

function send_next_bytes(event) { 

    var enc = new TextEncoder();

    if(!loader.hasNext()){
        console.log("all done!")
        loader.write_chunk(enc.encode("done"))
        return
    }
    console.log("sending next: ")
    var to_write = loader.next_chunk();
    console.log(to_write)
    loader.write_chunk(to_write);
}

function load_file() {
    var input, file, fr;

    input = document.getElementById('fileinput');
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsArrayBuffer(file);

    function receivedText() {
        var result = fr.result;

        console.log("sending first chunk");
        loader.add_chunks(listify(result));
        
        characteristic.writeValue(loader.next_chunk());
    }
}

function listify(result) {
    //split into 512 byte sized chunks
    var l = []

    var enc = new TextEncoder();
    
    while(result.byteLength > 0){
        var chunk = result.slice(0,512)

        // l.push(_appendBuffer(chunk, enc.encode('p')))
        l.push(chunk);
        l.push(enc.encode("|"))
        result = result.slice(512)
    }

    return l
}

function _appendBuffer(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  };

setup();

