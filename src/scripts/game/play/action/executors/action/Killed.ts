import { IImmutableScene, Scene } from "../../../../../engine/scene/Scene";
import { IGameAction } from "../../../../board/GameBoard";

export interface IKilledAction extends IGameAction {
  type : "UNIT_KILLED",
}

export function ExecuteKilled(action : IGameAction, scene : IImmutableScene):IImmutableScene {
  scene = Scene.RemoveElementById(scene, action.data.entity_id);
  return scene;
}

