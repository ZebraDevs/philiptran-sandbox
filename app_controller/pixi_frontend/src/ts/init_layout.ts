
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

    

    var enc = new TextEncoder();
    // TODO: Move to pixi

    var button3 = document.createElement("BUTTON");

    button3.innerHTML = "UPDATE";
    button3.onmousedown = ()=>characteristic.writeValue(enc.encode("UPDATE"));
    button3.onmouseup = ()=>characteristic.writeValue(enc.encode("STOP"));
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(button3);

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
        let error = document.getElementById("error_msg");
        error.innerHTML = "Connected successfully! You can now vroom vroom the robot";
    })
    .catch( _ => {
        let error = document.getElementById("error_msg");
        error.innerHTML = "Failed to connect successfully! Please try again";
    })
}

function send_next_bytes(event) { 

    var enc = new TextEncoder();

    if(!loader.hasNext()){
        console.log("all done!")
        var currentdate = new Date(); 
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        console.log(datetime)
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
        var currentdate = new Date(); 
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        console.log(datetime)
        loader.add_chunks(listify(result));
        
        characteristic.writeValue(loader.next_chunk());
    }
}

function listify(result) {
    //split into 512 byte sized chunks
    var l = []

    var enc = new TextEncoder();
    
    while(result.byteLength > 0){
        var chunk = result.slice(0,511)

        l.push(_appendBuffer(chunk, enc.encode('|')))
        // l.push(chunk);
        // l.push(enc.encode("|"))
        result = result.slice(511)
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

