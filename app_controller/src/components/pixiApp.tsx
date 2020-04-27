// Handles the initation and manipulation of
// pixijs elements

import * as PIXI from "pixi.js"
import React from 'react';

class PIXIApp extends React.Component {
    
    private app: PIXI.Application; 

    constructor(props: any) {
        super(props);
        const setup = () => {
            let sprite = new PIXI.Sprite(
                this.app.loader.resources["../fetchlogo.jpg"].texture
              );
            this.app.stage.addChild(sprite);
        }
        this.app = new PIXI.Application({height:500, width:500}); // hard coded for now bc i am trash. 
        var renderer = PIXI.autoDetectRenderer();document.body.appendChild(this.app.view);this.app.view.style.position = 'absolute';this.app.view.style.left = '50%';this.app.view.style.top = '50%';this.app.view.style.transform = 'translate3d( -50%, -50%, 0 )';
        this.app.loader
        .add("../fetchlogo.jpg")
        .load(setup);
    }

    render(){ // returns nothing, but I wanted it to be part of the component tree for organization purposes
        return(<></>);
    }
    

}

export default PIXIApp;