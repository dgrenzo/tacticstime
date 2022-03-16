import { GameBoard, IActionData, IBoardPos, IGameAction } from "../../../../board/GameBoard";
import { IImmutableScene } from "../../../../../engine/scene/Scene";


export interface IMoveAction extends IGameAction {
  type : "MOVE",
  data : IMoveActionData,
}
export interface IMoveActionData extends IActionData {
  move : {
    from ?: IBoardPos,
    to : IBoardPos,
  }
}

export function ExecuteMove(action : IMoveAction, scene : IImmutableScene):IImmutableScene {
  scene = GameBoard.SetElementPosition(scene, action.data.entity_id, action.data.move.to);
  return scene;
}