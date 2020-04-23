// Handles the initation and manipulation of
// pixijs elements

import * as PIXI from "pixi.js"

class PIXIApp {
    
    private app: PIXI.Application; 

    constructor(w: number, h:number) {
        const setup = () => {
            let sprite = new PIXI.Sprite(
                this.app.loader.resources["../fetchlogo.jpg"].texture
              );
            this.app.stage.addChild(sprite);
        }
        this.app = new PIXI.Application({height:h, width:w});
        var renderer = PIXI.autoDetectRenderer();document.body.appendChild(this.app.view);this.app.view.style.position = 'absolute';this.app.view.style.left = '50%';this.app.view.style.top = '50%';this.app.view.style.transform = 'translate3d( -50%, -50%, 0 )';
        this.app.loader
        .add("../fetchlogo.jpg")
        .load(setup);

        
    }
    

}

export default PIXIApp;