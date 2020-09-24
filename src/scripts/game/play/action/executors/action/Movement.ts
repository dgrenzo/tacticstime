import { IActionData, IGameAction } from "../../ActionStack";
import { UpdateFunction, IBoardPos } from "../../../../board/GameBoard";
import { IElementMap } from "../../../../../engine/scene/Scene";
import { BoardController } from "../../../../board/BoardController";


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
    let new_pos = {
      x : action.data.move.to.x,
      y : action.data.move.to.y
    }
    return elements.setIn([action.data.entity_id, 'pos'], new_pos)
  });
  
}