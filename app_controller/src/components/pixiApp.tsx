// Handles the initation and manipulation of
// pixijs elements

import * as PIXI from "pixi.js"

class PIXIApp {
    
    private app: PIXI.Application; 

    constructor(w: number, h:number) {
        this.app = new PIXI.Application({height:h, width:w});
    }

    stage(){
        document.body.appendChild(this.app.view);
    }
}

export default PIXIApp;