import { IActionData, IGameAction } from "../../ActionStack";
import { UpdateFunction, IBoardPos } from "../../../../board/GameBoard";
import { IElementMap } from "../../../../../engine/scene/Scene";
import { BoardController } from "../../../../board/BoardController";
import { UpdateElements } from "../../../UpdateElements";


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

export function ExecuteMove(action : IMoveAction, elements : IElementMap, controller : BoardController):Promise<IElementMap> {
  return controller.animateGameAction(action).then(( ) => { 
    return UpdateElements.SetPosition(elements, action.data.entity_id, action.data.move.to);
  });
  
}