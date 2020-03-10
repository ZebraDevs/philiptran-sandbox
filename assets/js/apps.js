

function log(str) {
	console.log(str);
}

var s;
var spd = 0.5;
var s2;

function connectToDevice() {
  console.log(navigator.bluetooth)
  serviceUuid = 'ac370e00-7c8c-4c47-917d-061425f3381b'
  characteristicUuid = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'
  log('Requesting Bluetooth Device...');
  options = {}
  options.acceptAllDevices = true;
  options.optionalServices = [serviceUuid.toLowerCase()];
  navigator.bluetooth.requestDevice(options)
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Service...');
    return server.getPrimaryService(serviceUuid.toLowerCase());
  })
  .then(service => {
    log('Getting Characteristic...');
    console.log("Setting up the buttons!")
    setUpAllButtons()
    return service.getCharacteristic(characteristicUuid)
  })
  .then(characteristic => {
    s = characteristic;
    s.addEventListener('characteristicvaluechanged',
        handleCharacteristicChange);
    
    characteristic.properties.notify = true;
    s.properties.notify = true;
    console.log(s)
    console.log(characteristic)



  })

}

function onStartNotificationsButtonClick() {
  log('Starting Notifications...');
  s.startNotifications()
  .then(_ => {
    log('> Notifications started');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

async function handleCharacteristicChange(event) {
  let result = await event.target.value;
  log('> NEW VAL: ' + arrayBufferToString(result['buffer']))
}


async function flip() {
	let result = await s
	console.log(result)
	promise = result.readValue()

	Promise.all([promise]).then(function(values) {
		var code = values[0].getInt8(0)
		encoder = new TextEncoder('utf-8');
		if(code == 49){
    		result.writeValue(encoder.encode(0))
    	}
    	else {
    		result.writeValue(encoder.encode(1))
    	}

	})


}

function setUpAllButtons() {
  var forwardBtn = document.getElementById("forwardButton");
  var backwardBtn = document.getElementById("backwardButton");
  var leftBtn = document.getElementById("leftButton");
  var rightBtn = document.getElementById("rightButton");
  setUpButton(forwardBtn, 1)
  setUpButton(backwardBtn, 2)
  setUpButton(leftBtn, 3)
  setUpButton(rightBtn, 4)

}


function setUpButton(btn, value_to_write){
  console.log(btn)
  btn.addEventListener('mousedown', async function(e){
    let result = await s
    console.log(result)
    try{
      promise = result.readValue()
      Promise.all([promise]).then(function(values) {
        try{
          var code = values[0].getInt8(0)
          encoder = new TextEncoder('utf-8');
          result.writeValue(encoder.encode(value_to_write))
        }
        catch(err) { 
          console.log("Stopping robot")
          encoder = new TextEncoder('utf-8');
          result.writeValue(encoder.encode(0))
        }

      })
    }
    catch(err) { 
      console.log("Stopping robot")
      result.writeValue(encoder.encode(0))
    }


  })

  btn.addEventListener('mouseup',async function(e){
    let result = await s
    console.log("Stopping robot")
    encoder = new TextEncoder('utf-8');
    result.writeValue(encoder.encode(0))
  })
}

async function incSpeed() {
  print("spd up")
  let result = await s
  encoder = new TextEncoder('utf-8');
  result.writeValue(encoder.encode(5))
  spd += 0.2
  var txt = document.getElementById("spd");
  txt.textContent="Spd: " + Math.round(spd * 100) / 100;
}
async function decSpeed() {
  spd -= 0.2
  var txt = document.getElementById("spd");
  txt.textContent="Spd: " + Math.round(spd * 100) / 100;
}




function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}


// if (typeof(w) == "undefined") {
//   w = new Worker("web_worker.js");
// }
// w.addEventListener('message', function(e) {
//   console.log('Worker said: ', e.data);
// }, false);
// console.log(w)

