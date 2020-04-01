var characteristic;
var idx = 0
var result;
var chunks;
var enc = new TextEncoder();

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
    // let msg = event.target.value.buffer
    // console.log(arrayBufferToString(msg));
    
    if(idx == chunks.length){
        console.log("all done!")
        characteristic.writeValue(enc.encode("done"))
        return
    }
    console.log("sending next: ")
    var to_write = chunks[idx]
    console.log(to_write)
    idx += 1
    let promise = characteristic.writeValue(to_write)
}

function load_file() {
    var input, file, fr;

    input = document.getElementById('fileinput');
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsArrayBuffer(file);

    function receivedText() {
        result = fr.result;
        console.log("sending first chunk")
        chunks = listify(result)
        characteristic.writeValue(chunks[idx])
        idx += 1
    }


}

function listify(result) {
    //split into 512 byte sized chunks
    var l = []
    while(result.byteLength > 0){
        var chunk = result.slice(0,512)
        l.push(chunk)
        l.push(enc.encode("|"))
        result = result.slice(512)
    }

    return l
}


setup();

