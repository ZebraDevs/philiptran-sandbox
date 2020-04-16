"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
window.PIXI = PIXI;
function initalize_application(width, height) {
    var Application = PIXI.Application;
    var app = new Application({ width: width, height: height });
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
function setup() {
    var red_button_textures = [app.loader.resources["assets/buttons/red_button_unpressed.png"].texture, app.loader.resources["assets/buttons/red_button_pressed.png"].texture];
    var blue_button_textures = [app.loader.resources["assets/buttons/blue_button_unpressed.png"].texture, app.loader.resources["assets/buttons/blue_button_pressed.png"].texture];
    var yellow_button_textures = [app.loader.resources["assets/buttons/yellow_button_unpressed.png"].texture, app.loader.resources["assets/buttons/yellow_button_pressed.png"].texture];
    init_button(app, red_button_textures, { 'x': 180, 'y': 86 }, "UP");
    init_button(app, blue_button_textures, { 'x': 50, 'y': 250 }, "LEFT");
    init_button(app, blue_button_textures, { 'x': 310, 'y': 250 }, "RIGHT");
    init_button(app, yellow_button_textures, { 'x': 500, 'y': 150 }, 'UPDATE');
}
function init_button(app, textures, pos, value_to_write, scale_x, scale_y, enc) {
    if (scale_x === void 0) { scale_x = .5; }
    if (scale_y === void 0) { scale_y = .5; }
    if (enc === void 0) { enc = new TextEncoder(); }
    var button = new PIXI.Sprite(textures[0]);
    button.scale.set(scale_x, scale_y);
    button.position.set(pos.x, pos.y);
    button.interactive = true;
    button
        .on('mousedown', function () {
        if (characteristic == undefined) {
            console.log("connect to bluetooth first");
            return;
        }
        button.texture = textures[1];
        characteristic.writeValue(enc.encode(value_to_write));
    })
        .on('mouseup', function () {
        if (characteristic == undefined) {
            return;
        }
        button.texture = textures[0];
        characteristic.writeValue(enc.encode("STOP"));
    });
    app.stage.addChild(button);
}
var app = initalize_application(700, 500);
