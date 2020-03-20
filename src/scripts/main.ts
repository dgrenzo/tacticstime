import * as PIXI from "pixi.js";
import { GameController } from "./game/GameController";
import { RenderMode } from "./engine/render/render";
import AssetManager from "./game/assets";
import { InitRenderPlugins } from "./game/extras/plugins";

export const DEBUG = false;


InitRenderPlugins();



PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let pixi_app : PIXI.Application = new PIXI.Application({
  forceCanvas : true,
  backgroundColor : 0x000011,
  view : <HTMLCanvasElement>document.getElementById('game_canvas')
});


let WindowResize = () => {
  pixi_app.renderer.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', WindowResize);
Promise.resolve().then(WindowResize);


AssetManager.init(() => {
  let game = new GameController({
    pixi_app : pixi_app, 
    mode : RenderMode.ISOMETRIC
  });
});