import { IImmutableScene, Scene } from "../../../../../engine/scene/Scene";
import { IActionData, IGameAction } from "../../../../board/GameBoard";
import { IUnit } from "../../../../board/Unit";

export interface IKilledAction extends IGameAction {
  type : "UNIT_KILLED",
  data : IKilledActionData
}

export interface IKilledActionData extends IActionData {
  source : IUnit,
}


export function ExecuteKilled(action : IGameAction, scene : IImmutableScene):IImmutableScene {
  scene = Scene.RemoveElementById(scene, action.data.entity_id);
  return scene;
}

