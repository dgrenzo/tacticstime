import { GameConfig } from "../../game/GameController";
import { SceneRendererIsometric } from './scene/isometric/SceneRendererIsometric';
import { SceneRenderer } from "./scene/SceneRenderer";

export enum RenderMode {
  ISOMETRIC = 0,
}

export function CreateRenderer(config : GameConfig) : SceneRenderer {
  switch (config.mode) {
    case RenderMode.ISOMETRIC : return new SceneRendererIsometric(config.pixi_app);
    default : return new SceneRendererIsometric(config.pixi_app);
  }
}