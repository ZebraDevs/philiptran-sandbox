import * as PIXI from "pixi.js"
window.PIXI = PIXI;

function initalize_application(width: number, height: number){
    
    let Application = PIXI.Application;
    
    let app = new Application({width: width, height: height});
    
    app.renderer.backgroundColor = 0x895044;
    document.body.appendChild(app.view);



    app.loader
        .add([
            "assets/buttons/red_button_pressed.png",
            "assets/buttons/red_button_unpressed.png", 
            "assets/buttons/blue_button_pressed.png",
            "assets/buttons/blue_button_unpressed.png", 
            "assets/buttons/yellow_button_pressed.png",
            "assets/buttons/yellow_button_unpressed.png"
        ])
        .load(setup);

    return app;
}
var app = initalize_application(700, 500);

function setup() {

    let red_button_textures = [app.loader.resources["assets/buttons/red_button_unpressed.png"].texture, app.loader.resources["assets/buttons/red_button_pressed.png"].texture];

    let blue_button_textures = [app.loader.resources["assets/buttons/blue_button_unpressed.png"].texture, app.loader.resources["assets/buttons/blue_button_pressed.png"].texture];

    let yellow_button_textures = [app.loader.resources["assets/buttons/yellow_button_unpressed.png"].texture, app.loader.resources["assets/buttons/yellow_button_pressed.png"].texture];

    init_button(app, red_button_textures, {'x':180, 'y':86}, "UP");
    init_button(app, blue_button_textures, {'x':50, 'y':250}, "LEFT");
    init_button(app, blue_button_textures, {'x':310, 'y':250}, "RIGHT");
    init_button(app, yellow_button_textures, {'x':500 , 'y':150}, 'UPDATE');

}

function init_button(app: PIXI.Application, textures: Array<PIXI.Texture>, pos, value_to_write: string, scale_x:number = .5, scale_y: number = .5, enc: TextEncoder = new TextEncoder()) {
    let button = new PIXI.Sprite(textures[0]);
    button.scale.set(scale_x,scale_y);
    button.position.set(pos.x, pos.y);
    button.interactive = true;
    button
        .on('mousedown', function() {
            if(characteristic == undefined){
                console.log("connect to bluetooth first");
                return;
            }
            button.texture = textures[1];
            characteristic.writeValue(enc.encode(value_to_write));
        })
        .on('mouseup', function() {
            if(characteristic == undefined){
                return
            }
            button.texture = textures[0];
            characteristic.writeValue(enc.encode("STOP"));
        })
    app.stage.addChild(button);
}
