
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
        console.log(characteristic)
    })
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