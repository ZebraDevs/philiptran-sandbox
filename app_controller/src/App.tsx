import React from 'react';
import './App.css';
import PIXIApp from "./components/pixiApp";
import BluetoothHandler from "./components/bluetoothHandler";


function App() {
  let app = new PIXIApp(500,500); 
  app.stage();

  return ( 
    <>
    < BluetoothHandler />
    </>
  );
}

export default App;
