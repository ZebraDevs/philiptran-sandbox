

function log(str) {
	console.log(str);
}

var s;
function connectToDevice() {
  console.log(navigator.bluetooth)
  serviceUuid = '4FAFC201-1FB5-459E-8FCC-C5C9C331914B'
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
    s =  service.getCharacteristic(characteristicUuid);
    console.log("Setting up the buttons!")
    setUpAllButtons()
  })
  

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

