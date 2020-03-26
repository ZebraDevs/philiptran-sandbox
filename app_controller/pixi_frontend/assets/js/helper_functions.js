
var UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
var characteristic;
var idx = 0
var result;
var chunks;
var enc = new TextEncoder();

function log(x) {
    console.log(x)
}

function connectToDevice() {
    navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices: [UUID]})
    .then(device => {
        log('Connecting to GATT Server...');
        return device.gatt.connect();
    })
    .then(server => {
        log("getting service")
        return(server.getPrimaryService(UUID))
    })
    .then(service => {
        log("Getting characteristics")
        return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8')
    })
    .then(_characteristic => {
        log("getting characteristic")
        characteristic = _characteristic;
        characteristic.startNotifications()
        characteristic.addEventListener('characteristicvaluechanged',
        handleChange);
        console.log(characteristic)
    })
}

function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}



async function setupButtons(app, textures,pos, to_write) {

    let button = new Sprite(textures[0]);
    button.interactive = true;
    button.scale.set(.5,.5);
    button.position.set(pos.x,pos.y);
    encoder = new TextEncoder('utf-8');
    button.on('mousedown', function(){
        if(characteristic == undefined){
            console.log("connect to bluetooth first")
            return
        }
        console.log("sending!")
        button.texture = textures[1]
        characteristic.writeValue(encoder.encode(to_write))
    });

    button.on('mouseup', function(){
        if(characteristic == undefined){
            console.log("connect to bluetooth first")
            return
        }
        button.texture = textures[0]
        characteristic.writeValue(encoder.encode(0))
    });
    app.stage.addChild(button)
}

// BLE-OTA CODE

function loadFile() {
        var input, file, fr;

        if (typeof window.FileReader !== 'function') {
            bodyAppend("p", "The file API isn't supported on this browser yet.");
            return;
        }

        input = document.getElementById('fileinput');
        if (!input) {
            bodyAppend("p", "Um, couldn't find the fileinput element.");
        }
        else if (!input.files) {
            bodyAppend("p", "This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            bodyAppend("p", "Please select a file before clicking 'Load'");
        }
        else {
            file = input.files[0];
            fr = new FileReader();
            fr.onload = receivedText;
            fr.readAsArrayBuffer(file);
        }

        function receivedText() {
            showResult(fr, "Text");


        }

 
    }

    function handleChange(event) { 
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
        characteristic.writeValue(to_write)
    }

    function showResult(fr, label) {
        markup = [];
        result = fr.result;

        console.log("sending first chunk")
        chunks = listify(result)
        characteristic.writeValue(chunks[idx])
        idx += 1

        

        // processQ(markup)

    }
    function listify(result) {
        //split into 512 byte sized chunks
        l = []
        var i = 0;
        while(result.byteLength > 0){
            var chunk = result.slice(0,512)
            l.push(enc.encode(i))
            l.push(enc.encode("|"))
            result = result.slice(512)
            i += 1
        }

        return l



    }
    
