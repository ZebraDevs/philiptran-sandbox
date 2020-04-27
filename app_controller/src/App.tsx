import React from 'react';
import './App.css';
import PIXIApp from "./components/pixiApp";
import BluetoothHandler from "./components/bluetoothHandler";


function App() {

  return ( 
    <>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet"></link>
    </head>
    <body>
        < BluetoothHandler />
        < PIXIApp />
    </body>
    </>
  );
}

export default App;
