
var UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
var characteristic;

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

function handleChange(event) { 
    let msg = event.target.value.buffer
    console.log(arrayBufferToString(msg));
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