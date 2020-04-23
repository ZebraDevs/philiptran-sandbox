import React from 'react';
import './App.css';
import PIXIApp from "./components/pixiApp";
import BluetoothHandler from "./components/bluetoothHandler";


function App() {
  let app = new PIXIApp(500,500); 

  return ( 
    <>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet"></link>
    </head>
    <body>
        < BluetoothHandler />
    </body>
    </>
  );
}

export default App;
