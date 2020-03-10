
self.addEventListener('message', function(e) {
  console.log(e.data.msg.readValue());
}, false);

console.log(navigator.bluetooth)